import { onAuthStateChanged, signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../firebase/firebase';

export class FirebaseSessionTest {
  /**
   * Test Firebase session management
   */
  static async testFirebaseSession() {
    console.log('=== Firebase Session Management Test ===');
    
    try {
      // Test 1: Check current authentication state
      console.log('1. Checking current auth state...');
      const currentUser = FIREBASE_AUTH.currentUser;
      console.log('Current user:', currentUser ? currentUser.email : 'No user');
      
      // Test 2: Set up auth state listener
      console.log('2. Setting up auth state listener...');
      const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
        if (user) {
          console.log('Auth state: User is signed in -', user.email);
        } else {
          console.log('Auth state: User is signed out');
        }
      });
      
      // Test 3: Test login (if you have test credentials)
      // Uncomment and replace with actual test credentials
      /*
      console.log('3. Testing login...');
      await signInWithEmailAndPassword(FIREBASE_AUTH, 'test@example.com', 'password123');
      console.log('Login successful');
      
      // Wait a moment for auth state to update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Test 4: Test logout
      console.log('4. Testing logout...');
      await signOut(FIREBASE_AUTH);
      console.log('Logout successful');
      */
      
      console.log('=== Firebase Session Test Complete ===');
      
      // Cleanup
      unsubscribe();
      
    } catch (error) {
      console.error('Firebase session test failed:', error);
    }
  }
  
  /**
   * Check if user is currently authenticated
   */
  static isUserAuthenticated(): boolean {
    return !!FIREBASE_AUTH.currentUser;
  }
  
  /**
   * Get current user info
   */
  static getCurrentUser() {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
      };
    }
    return null;
  }
  
  /**
   * Manual logout for testing
   */
  static async testLogout() {
    try {
      await signOut(FIREBASE_AUTH);
      console.log('Test logout successful');
    } catch (error) {
      console.error('Test logout failed:', error);
    }
  }
}