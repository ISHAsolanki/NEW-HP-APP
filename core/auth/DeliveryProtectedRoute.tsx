// File: core/auth/DeliveryProtectedRoute.tsx
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from './AuthContext';

interface DeliveryProtectedRouteProps {
  children: React.ReactNode;
}

export const DeliveryProtectedRoute: React.FC<DeliveryProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, userSession } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !userSession) {
        // User is not authenticated, redirect to auth screen
        router.replace('/');
      } else if (userSession.role !== 'delivery') {
        // User is authenticated but not a delivery agent, redirect based on role
        if (userSession.role === 'admin') {
          router.replace('/admin/admindashboard');
        } else {
          router.replace('/customer/home');
        }
      }
    }
  }, [isAuthenticated, isLoading, userSession]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );
  }

  // Don't render children if not authenticated or not delivery agent
  if (!isAuthenticated || !userSession || userSession.role !== 'delivery') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );
  }

  // Render children if authenticated and delivery agent
  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});