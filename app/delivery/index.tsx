import { router } from 'expo-router';
import { useEffect } from 'react';

export default function DeliveryIndex() {
  useEffect(() => {
    // Redirect to delivery dashboard
    router.replace('/delivery/deliverydashboard');
  }, []);

  return null;
}