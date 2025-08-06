import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from './AuthContext';

interface PermissionProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission: string;
  fallbackRoute?: string;
}

export const PermissionProtectedRoute: React.FC<PermissionProtectedRouteProps> = ({
  children,
  requiredPermission,
  fallbackRoute = '/admin/admindashboard'
}) => {
  const { userSession } = useAuth();

  // Check if user has permission
  const hasPermission = () => {
    // Full admin has all permissions
    if (userSession?.role === 'admin') return true;
    
    // Sub-admin needs specific permission
    if (userSession?.role === 'sub-admin') {
      return userSession?.permissions?.includes(requiredPermission) || false;
    }
    
    return false;
  };

  // If no permission, redirect to fallback route
  if (!hasPermission()) {
    React.useEffect(() => {
      router.replace(fallbackRoute);
    }, []);

    return (
      <View style={styles.container}>
        <Text style={styles.text}>Access Denied</Text>
        <Text style={styles.subtext}>You don't have permission to access this page</Text>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
});