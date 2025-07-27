import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold, useFonts } from '@expo-google-fonts/inter';
import { router } from 'expo-router';
import { ArrowLeft, MapPin } from 'lucide-react-native';
import React, { useState } from 'react';
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

// --- Mock Data ---
const user = {
    address: '123, Main Street, Near Water Tank, Vadodara, Gujarat - 390001'
};

const orderDetails = {
    subtotal: 1300,
    deliveryCharge: 30,
    gst: 65,
    discount: 50,
    total: 1345,
};

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const [selectedSlot, setSelectedSlot] = useState('today');
  const [selectedPayment, setSelectedPayment] = useState('cod');

  let [fontsLoaded] = useFonts({
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold,
  });

  if (!fontsLoaded) {
    return <View style={styles.loadingContainer} />;
  }

  const PaymentOption = ({ value, label }) => (
    <TouchableOpacity 
        style={[styles.paymentOption, selectedPayment === value && styles.paymentOptionSelected]}
        onPress={() => setSelectedPayment(value)}
    >
        <Text style={[styles.paymentLabel, selectedPayment === value && styles.paymentLabelSelected]}>{label}</Text>
        <View style={[styles.radioOuter, selectedPayment === value && styles.radioSelected]}>
            {selectedPayment === value && <View style={styles.radioInner}/>}
        </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
                <ArrowLeft size={26} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Checkout</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Delivery Address */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <View style={styles.addressCard}>
                <MapPin size={24} color={Colors.primary} />
                <Text style={styles.addressText}>{user.address}</Text>
                <TouchableOpacity>
                    <Text style={styles.changeButtonText}>Change</Text>
                </TouchableOpacity>
            </View>
        </View>

        {/* Delivery Slot */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Delivery Slot</Text>
            <View style={styles.slotContainer}>
                <TouchableOpacity 
                    style={[styles.slotButton, selectedSlot === 'today' && styles.slotButtonSelected]}
                    onPress={() => setSelectedSlot('today')}
                >
                    <Text style={[styles.slotText, selectedSlot === 'today' && styles.slotTextSelected]}>Today</Text>
                    <Text style={[styles.slotSubText, selectedSlot === 'today' && styles.slotSubTextSelected]}>Within 2 hours</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.slotButton, selectedSlot === 'tomorrow' && styles.slotButtonSelected]}
                    onPress={() => setSelectedSlot('tomorrow')}
                >
                    <Text style={[styles.slotText, selectedSlot === 'tomorrow' && styles.slotTextSelected]}>Tomorrow</Text>
                    <Text style={[styles.slotSubText, selectedSlot === 'tomorrow' && styles.slotSubTextSelected]}>9am - 6pm</Text>
                </TouchableOpacity>
            </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.paymentContainer}>
                <PaymentOption value="cod" label="Cash on Delivery" />
                <PaymentOption value="card" label="Credit/Debit Card" />
                <PaymentOption value="upi" label="UPI / Net Banking" />
            </View>
        </View>

        {/* Order Details */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order details</Text>
            <View style={styles.billCard}>
                <View style={styles.billRow}>
                    <Text style={styles.billLabel}>Item Total</Text>
                    <Text style={styles.billValue}>₹{orderDetails.subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.billRow}>
                    <Text style={styles.billLabel}>Delivery Charge</Text>
                    <Text style={styles.billValue}>₹{orderDetails.deliveryCharge.toFixed(2)}</Text>
                </View>
                <View style={styles.billRow}>
                    <Text style={styles.billLabel}>GST (5%)</Text>
                    <Text style={styles.billValue}>₹{orderDetails.gst.toFixed(2)}</Text>
                </View>
                <View style={styles.billRow}>
                    <Text style={[styles.billLabel, {color: Colors.green}]}>Promo Discount</Text>
                    <Text style={[styles.billValue, {color: Colors.green}]}>- ₹{orderDetails.discount.toFixed(2)}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.billRow}>
                    <Text style={styles.billTotalLabel}>To Pay</Text>
                    <Text style={styles.billTotalValue}>₹{orderDetails.total.toFixed(2)}</Text>
                </View>
            </View>
        </View>
      </ScrollView>

      {/* Checkout Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <View>
            <Text style={styles.footerTotalAmount}>₹{orderDetails.total.toFixed(2)}</Text>
            <Text style={styles.footerTotalLabel}>TOTAL</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={() => router.push('/customer/ordercomplete')}>
            <Text style={styles.checkoutButtonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingBottom: 20,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: { padding: 8 },
  headerTitle: { 
    fontSize: 20, 
    fontFamily: 'Inter_600SemiBold', 
    color: Colors.white,
    marginLeft: 12,
  },
  content: {
    padding: 20,
    paddingBottom: 120, // Space for the footer
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
    marginBottom: 16,
  },
  addressCard: {
      backgroundColor: Colors.surface,
      borderRadius: 16,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      shadowColor: '#959DA5',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
  },
  addressText: {
      flex: 1,
      fontSize: 14,
      fontFamily: 'Inter_400Regular',
      color: Colors.text,
      lineHeight: 22,
  },
  changeButtonText: {
      fontSize: 14,
      fontFamily: 'Inter_600SemiBold',
      color: Colors.primary,
  },
  slotContainer: {
      flexDirection: 'row',
      gap: 16,
  },
  slotButton: {
      flex: 1,
      backgroundColor: Colors.surface,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1.5,
      borderColor: Colors.border,
  },
  slotButtonSelected: {
      backgroundColor: Colors.primaryLighter,
      borderColor: Colors.primary,
  },
  slotText: {
      fontSize: 14,
      fontFamily: 'Inter_600SemiBold',
      color: Colors.text,
  },
  slotTextSelected: {
      color: Colors.primary,
  },
  slotSubText: {
      fontSize: 12,
      fontFamily: 'Inter_400Regular',
      color: Colors.textSecondary,
      marginTop: 4,
  },
  slotSubTextSelected: {
      color: Colors.primary,
  },
  paymentContainer: {
      gap: 12,
  },
  paymentOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: Colors.surface,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: Colors.border,
  },
  paymentOptionSelected: {
      backgroundColor: Colors.primaryLighter,
      borderColor: Colors.primary,
  },
  paymentLabel: {
      fontSize: 14,
      fontFamily: 'Inter_500Medium',
      color: Colors.text,
  },
  paymentLabelSelected: {
      fontFamily: 'Inter_600SemiBold',
      color: Colors.primary,
  },
  radioOuter: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: Colors.border,
      alignItems: 'center',
      justifyContent: 'center',
  },
  radioSelected: {
      borderColor: Colors.primary,
  },
  radioInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: Colors.primary,
  },
  billCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#959DA5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  billLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
  },
  billValue: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  billTotalLabel: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
  },
  billTotalValue: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: Colors.primary,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  footerTotalAmount: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: Colors.primary,
  },
  footerTotalLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: Colors.textSecondary,
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  checkoutButtonText: {
    color: Colors.white,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
});