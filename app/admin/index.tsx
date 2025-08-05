// File: app/admin/index.tsx
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { View } from 'react-native';

export default function AdminIndexScreen() {
  useEffect(() => {
    // Redirect to the admin dashboard
    router.replace('/admin/admindashboard');
  }, []);

  return <View />;
}
