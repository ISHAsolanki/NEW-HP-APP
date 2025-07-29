import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../core/auth/AuthContext';
import AuthScreen from './auth/auth';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // User is authenticated, redirect to customer home
      router.replace('/customer/home');
    }
  }, [isAuthenticated, isLoading]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0D47A1" />
      </View>
    );
  }

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  // This shouldn't be reached due to the useEffect redirect, but just in case
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0D47A1" />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
