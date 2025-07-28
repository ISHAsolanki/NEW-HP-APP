import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { router } from 'expo-router';
import { Check, Hash, MapPin, ShoppingBag, Wallet } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// --- Color Palette (Matched with previous screens) ---
const Colors = {
  primary: '#0D47A1',
  primaryLight: '#1E88E5',
  primaryLighter: '#E3F2FD',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#1D3557',
  textSecondary: '#6C757D',
  border: '#EAECEF',
  white: '#FFFFFF',
  green: '#16A34A',
};

// --- Mock Data for Confirmation ---
const confirmedOrder = {
    id: 'ORD003',
    total: 1345,
    paymentMode: 'Cash on Delivery',
    address: '123, Main Street, Near Water Tank, Vadodara, Gujarat - 390001'
};

export default function OrderPlacedScreen() {
  const insets = useSafeAreaInsets();

  let [fontsLoaded] = useFonts({
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold,
  });

  if (!fontsLoaded) {
    return <View style={styles.loadingContainer} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.successContainer}>
            <View style={styles.successIconCircle}>
                <Check size={48} color={Colors.green} />
            </View>
            <Text style={styles.successTitle}>Order Placed Successfully!</Text>
            <Text style={styles.successSubtitle}>
                Your order has been confirmed. You will receive an update once your order is out for delivery.
            </Text>
        </View>

        <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
                <Hash size={20} color={Colors.textSecondary} />
                <Text style={styles.summaryLabel}>Order ID</Text>
                <Text style={styles.summaryValue}>#{confirmedOrder.id}</Text>
            </View>
            <View style={styles.summaryRow}>
                <ShoppingBag size={20} color={Colors.textSecondary} />
                <Text style={styles.summaryLabel}>Total Amount</Text>
                <Text style={styles.summaryValue}>₹{confirmedOrder.total.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
                <Wallet size={20} color={Colors.textSecondary} />
                <Text style={styles.summaryLabel}>Payment Mode</Text>
                <Text style={styles.summaryValue}>{confirmedOrder.paymentMode}</Text>
            </View>
            <View style={[styles.summaryRow, {alignItems: 'flex-start'}]}>
                <MapPin size={20} color={Colors.textSecondary} />
                <Text style={styles.summaryLabel}>Deliver to</Text>
                <Text style={[styles.summaryValue, {textAlign: 'right', flex: 1}]}>{confirmedOrder.address}</Text>
            </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 70 }]}>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/customer/home')}>
            <Text style={styles.secondaryButtonText}>Go to Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/customer/orders')}>
            <Text style={styles.primaryButtonText}>Track Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  container: { flex: 1, backgroundColor: Colors.background },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingBottom: 120,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  successIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${Colors.green}1A`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: '90%',
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    shadowColor: '#959DA5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  summaryLabel: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: Colors.text,
    flex: 1,
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    padding: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    gap: 16,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: Colors.white,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryButtonText: {
    color: Colors.text,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
});