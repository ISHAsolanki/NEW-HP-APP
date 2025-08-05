// File: core/services/deliveryAuthService.ts
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { FIREBASE_DB } from '../firebase/firebase';
import { SessionManager, UserSession } from '../session/sessionManager';

export const deliveryAuthService = {
  // Authenticate delivery agent with email and password
  async authenticateDeliveryAgent(email: string, password: string): Promise<UserSession | null> {
    try {
      // Query delivery credentials
      const credentialsQuery = query(
        collection(FIREBASE_DB, 'delivery_credentials'),
        where('email', '==', email)
      );
      
      const credentialsSnapshot = await getDocs(credentialsQuery);
      
      if (credentialsSnapshot.empty) {
        throw new Error('Invalid email or password');
      }

      const credentialDoc = credentialsSnapshot.docs[0];
      const credentials = credentialDoc.data();

      // Check password (in production, this should be hashed comparison)
      if (credentials.password !== password) {
        throw new Error('Invalid email or password');
      }

      // Get delivery agent details
      const agentRef = doc(FIREBASE_DB, 'delivery_agents', credentials.uid);
      const agentDoc = await getDoc(agentRef);

      if (!agentDoc.exists()) {
        throw new Error('Delivery agent not found');
      }

      const agentData = agentDoc.data();

      // Check if agent is active
      if (!agentData.isActive) {
        throw new Error('Your account has been deactivated. Please contact admin.');
      }

      // Create user session
      const userSession: UserSession = {
        uid: credentials.uid,
        email: credentials.email,
        displayName: agentData.name,
        role: 'delivery',
        sessionToken: SessionManager.generateSessionToken(),
        loginTime: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      };

      return userSession;
    } catch (error: any) {
      console.error('Error authenticating delivery agent:', error);
      throw error;
    }
  },

  // Check if email exists in delivery credentials
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const credentialsQuery = query(
        collection(FIREBASE_DB, 'delivery_credentials'),
        where('email', '==', email)
      );
      
      const credentialsSnapshot = await getDocs(credentialsQuery);
      return !credentialsSnapshot.empty;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  }
};