import { Tabs } from 'expo-router';
import { BarChart2, ClipboardList, User } from 'lucide-react-native';
import { Platform } from 'react-native';
import { HapticTab } from '../../components/HapticTab';
import TabBarBackground from '../../components/ui/TabBarBackground';
import { DeliveryProtectedRoute } from '../../core/auth/DeliveryProtectedRoute';
import { useColorScheme } from '../../hooks/useColorScheme';

export default function DeliveryTabLayout() {
  const colorScheme = useColorScheme();

  return (
    <DeliveryProtectedRoute>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#DC2626', // Red color for delivery theme
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            href: null, // This hides the tab from the tab bar
          }}
        />
        <Tabs.Screen
          name="deliverydashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, focused }) => (
              <BarChart2 size={24} color={focused ? color : color} fill="transparent" />
            ),
          }}
        />
        <Tabs.Screen
          name="deliveryorderassignment"
          options={{
            title: 'Orders',
            tabBarIcon: ({ color, focused }) => (
              <ClipboardList size={24} color={focused ? color : color} fill="transparent" />
            ),
          }}
        />
        <Tabs.Screen
          name="deliveryprofile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <User size={24} color={focused ? color : color} fill="transparent" />
            ),
          }}
        />
      </Tabs>
    </DeliveryProtectedRoute>
  );
}

