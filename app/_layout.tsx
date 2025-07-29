import { Stack } from "expo-router";
import { AuthProvider } from '../core/auth/AuthContext';
import { CartProvider } from "../core/context/CartContext";
import '../global.css';

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth/auth" />
          <Stack.Screen name="customer" options={{ headerShown: false }} />
        </Stack>
      </CartProvider>
    </AuthProvider>
  );
}
