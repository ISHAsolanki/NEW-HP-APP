import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { FIREBASE_AUTH } from '../firebase/firebase';
import { SessionManager, UserSession } from '../session/sessionManager';

interface AuthContextType {
  user: User | null;
  userSession: UserSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userSession: UserSession) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userSession: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for existing valid session in AsyncStorage
        const hasValidSession = await SessionManager.hasValidSession();
        if (hasValidSession) {
          const existingSession = await SessionManager.getSession();
          if (existingSession) {
            console.log('Found valid existing session:', existingSession.email);
            setUserSession(existingSession);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      }
    };

    initializeAuth();

    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (firebaseUser) => {
      console.log('Firebase auth state changed:', firebaseUser ? 'User authenticated' : 'User not authenticated');
      setUser(firebaseUser);
      
      // If Firebase user is null but we have a session, clear the session
      if (!firebaseUser && userSession) {
        handleLogout();
      }
      
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLogin = async (session: UserSession) => {
    try {
      await SessionManager.saveSession(session);
      setUserSession(session);
      console.log('Session saved successfully for:', session.email);
    } catch (error) {
      console.error('Error saving session:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      // Clear session from AsyncStorage
      await SessionManager.clearSession();
      setUserSession(null);
      
      // Sign out from Firebase
      if (user) {
        await signOut(FIREBASE_AUTH);
      }
      
      setUser(null);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    userSession,
    isLoading,
    isAuthenticated: !!(user && userSession),
    login: handleLogin,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};