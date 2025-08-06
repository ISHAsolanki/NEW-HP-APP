// File: core/services/subAdminService.ts
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FIREBASE_DB } from '../firebase/firebase';
import { UserData, userService } from './userService';

// Available permissions for sub-admin
export const AVAILABLE_PERMISSIONS = {
  DASHBOARD: 'dashboard',
  ORDERS: 'orders',
  PRODUCTS: 'products',
  DELIVERY: 'delivery',
  PROFILE: 'profile',
} as const;

export type Permission = typeof AVAILABLE_PERMISSIONS[keyof typeof AVAILABLE_PERMISSIONS];

export interface SubAdminData extends UserData {
  permissions: Permission[];
}

export const subAdminService = {
  // Get all sub-admin users
  async getAllSubAdmins(): Promise<SubAdminData[]> {
    try {
      const usersRef = collection(FIREBASE_DB, 'users');
      const q = query(usersRef, where('role', '==', 'sub-admin'));
      const querySnapshot = await getDocs(q);
      
      const subAdmins: SubAdminData[] = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data() as UserData;
        subAdmins.push({
          ...userData,
          permissions: userData.permissions || [],
        });
      });
      
      return subAdmins;
    } catch (error) {
      console.error('Error getting sub-admins:', error);
      return [];
    }
  },

  // Create a new sub-admin
  async createSubAdmin(userData: Partial<UserData>, permissions: Permission[]): Promise<void> {
    if (!userData.uid) throw new Error('User ID is required');
    
    await userService.createUser({
      ...userData,
      role: 'sub-admin',
      permissions,
    });
  },

  // Update sub-admin permissions
  async updateSubAdminPermissions(uid: string, permissions: Permission[]): Promise<void> {
    await userService.updateUserPermissions(uid, permissions);
  },

  // Promote user to sub-admin with permissions
  async promoteToSubAdmin(uid: string, permissions: Permission[]): Promise<void> {
    await userService.updateUserRoleAndPermissions(uid, 'sub-admin', permissions);
  },

  // Demote sub-admin to regular user
  async demoteSubAdmin(uid: string): Promise<void> {
    await userService.updateUserRoleAndPermissions(uid, 'customer', []);
  },

  // Check if user has specific permission
  hasPermission(userPermissions: string[] | undefined, requiredPermission: Permission): boolean {
    return userPermissions?.includes(requiredPermission) || false;
  },

  // Get permission display name
  getPermissionDisplayName(permission: Permission): string {
    const displayNames: Record<Permission, string> = {
      [AVAILABLE_PERMISSIONS.DASHBOARD]: 'Dashboard',
      [AVAILABLE_PERMISSIONS.ORDERS]: 'Orders Management',
      [AVAILABLE_PERMISSIONS.PRODUCTS]: 'Products Management',
      [AVAILABLE_PERMISSIONS.DELIVERY]: 'Delivery Management',
      [AVAILABLE_PERMISSIONS.PROFILE]: 'Profile',
    };
    
    return displayNames[permission] || permission;
  },

  // Get all available permissions
  getAllPermissions(): Permission[] {
    return Object.values(AVAILABLE_PERMISSIONS);
  },

  // Validate permissions array
  validatePermissions(permissions: string[]): Permission[] {
    const validPermissions = this.getAllPermissions();
    return permissions.filter(p => validPermissions.includes(p as Permission)) as Permission[];
  },
};