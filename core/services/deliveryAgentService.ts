// File: core/services/deliveryAgentService.ts
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebase/firebase';
import { userService } from './userService';

// Delivery Agent interface
export interface DeliveryAgent {
  id?: string;
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: 'delivery';
  isActive: boolean;
  deliveriesThisWeek?: number;
  remainingToday?: number;
  totalAllotted?: number;
  createdAt: number;
  updatedAt: number;
}

export const deliveryAgentService = {
  // Create a new delivery agent with Firebase Auth registration
  async createDeliveryAgent(agentData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }, adminCredentials?: { email: string; password: string }): Promise<DeliveryAgent> {
    try {
      // Store current admin user info
      const currentUser = FIREBASE_AUTH.currentUser;
      const adminEmail = currentUser?.email;
      
      // Create Firebase Auth user for delivery agent
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        agentData.email,
        agentData.password
      );
      
      const uid = userCredential.user.uid;
      const timestamp = Date.now();

      // Create delivery agent data
      const deliveryAgent: DeliveryAgent = {
        uid,
        name: agentData.name,
        email: agentData.email,
        phone: agentData.phone,
        role: 'delivery',
        isActive: true,
        deliveriesThisWeek: 0,
        remainingToday: 0,
        totalAllotted: 0,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      // Store in users collection with role 'delivery'
      await userService.createUser({
        uid,
        email: agentData.email,
        displayName: agentData.name,
        role: 'delivery',
        phoneNumber: agentData.phone,
      });

      // Store in delivery_agents collection for admin management
      const agentRef = doc(FIREBASE_DB, 'delivery_agents', uid);
      await setDoc(agentRef, deliveryAgent);

      // Sign out the newly created delivery agent
      await signOut(FIREBASE_AUTH);

      // If admin credentials are provided, sign the admin back in
      if (adminCredentials && adminEmail) {
        try {
          await signInWithEmailAndPassword(FIREBASE_AUTH, adminCredentials.email, adminCredentials.password);
        } catch (adminSignInError) {
          console.warn('Could not restore admin session:', adminSignInError);
          // The delivery agent was created successfully, but admin needs to log back in
        }
      }

      return { ...deliveryAgent, id: uid };
    } catch (error: any) {
      console.error('Error creating delivery agent:', error);
      
      // Handle specific Firebase Auth errors
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email is already registered');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address');
      }
      
      throw new Error('Failed to create delivery agent');
    }
  },

  // Get all delivery agents
  async getAllDeliveryAgents(): Promise<DeliveryAgent[]> {
    try {
      const agentsRef = collection(FIREBASE_DB, 'delivery_agents');
      const snapshot = await getDocs(agentsRef);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as DeliveryAgent));
    } catch (error) {
      console.error('Error getting delivery agents:', error);
      throw new Error('Failed to fetch delivery agents');
    }
  },

  // Update delivery agent
  async updateDeliveryAgent(uid: string, updateData: Partial<DeliveryAgent>): Promise<void> {
    try {
      const agentRef = doc(FIREBASE_DB, 'delivery_agents', uid);
      await updateDoc(agentRef, {
        ...updateData,
        updatedAt: Date.now(),
      });

      // Also update in users collection if name or phone changed
      if (updateData.name || updateData.phone) {
        await userService.updateUser(uid, {
          displayName: updateData.name,
          phoneNumber: updateData.phone,
        });
      }
    } catch (error) {
      console.error('Error updating delivery agent:', error);
      throw new Error('Failed to update delivery agent');
    }
  },

  // Delete delivery agent
  async deleteDeliveryAgent(uid: string): Promise<void> {
    try {
      // Delete from delivery_agents collection
      const agentRef = doc(FIREBASE_DB, 'delivery_agents', uid);
      await deleteDoc(agentRef);

      // Note: We don't delete from Firebase Auth or users collection
      // Instead, we could deactivate the user or change their role
      await userService.updateUser(uid, {
        role: 'inactive',
      });
    } catch (error) {
      console.error('Error deleting delivery agent:', error);
      throw new Error('Failed to delete delivery agent');
    }
  },

  // Toggle agent active status
  async toggleAgentStatus(uid: string, isActive: boolean): Promise<void> {
    try {
      const agentRef = doc(FIREBASE_DB, 'delivery_agents', uid);
      await updateDoc(agentRef, {
        isActive,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error('Error toggling agent status:', error);
      throw new Error('Failed to update agent status');
    }
  },

  // Update delivery statistics
  async updateDeliveryStats(uid: string, stats: {
    deliveriesThisWeek?: number;
    remainingToday?: number;
    totalAllotted?: number;
  }): Promise<void> {
    try {
      const agentRef = doc(FIREBASE_DB, 'delivery_agents', uid);
      await updateDoc(agentRef, {
        ...stats,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error('Error updating delivery stats:', error);
      throw new Error('Failed to update delivery statistics');
    }
  }
};