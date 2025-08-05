import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, CheckCircle, MapPin, Package, Phone, Truck } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// --- Red Color Palette ---
const Colors = {
  primary: '#DC2626', // A modern, strong red
  primaryLight: '#F87171',
  primaryLighter: '#FEE2E2',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  white: '#FFFFFF',
  yellow: '#F59E0B',
  blue: '#3B82F6',
  green: '#16A34A',
};

const initialOrdersData = [
    {
      id: 'ORD001',
      customer: 'John Doe',
      phone: '+91 9876543210',
      product: 'HP Gas 14.2kg',
      quantity: 1,
      amount: 880,
      address: '123 Main Street, Apartment 4B, City - 400001',
      orderTime: '10:30 AM',
      status: 'Assigned',
      distance: '2.5 km',
    },
    {
      id: 'ORD002',
      customer: 'Jane Smith',
      phone: '+91 9876543211',
      product: 'HP Gas 19kg',
      quantity: 2,
      amount: 2500,
      address: '456 Oak Avenue, House 12, City - 400002',
      orderTime: '11:15 AM',
      status: 'On the Way',
      distance: '1.8 km',
    },
    {
      id: 'ORD000',
      customer: 'Mike Johnson',
      phone: '+91 9876543212',
      product: 'HP Gas 14.2kg',
      quantity: 1,
      amount: 880,
      address: '789 Pine Street, Flat 3A, City - 400003',
      orderTime: '9:00 AM',
      deliveredTime: '10:30 AM',
      status: 'Delivered',
    },
];

export default function DeliveryOrdersScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('assigned');
  const [orders, setOrders] = useState(initialOrdersData);

  let [fontsLoaded] = useFonts({
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold,
  });

  const assignedOrders = orders.filter(o => o.status === 'Assigned' || o.status === 'On the Way');
  const completedOrders = orders.filter(o => o.status === 'Delivered');

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return Colors.green;
      case 'On the Way': return Colors.blue;
      case 'Assigned': return Colors.yellow;
      default: return Colors.textSecondary;
    }
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(currentOrders =>
        currentOrders.map(order =>
            order.id === orderId
                ? { ...order, status: newStatus }
                : order
        )
    );
  };

  if (!fontsLoaded) {
    return <View style={styles.loadingContainer} />;
  }

  const renderOrderCard = (order, showActions = true) => {
    const statusColor = getStatusColor(order.status);

    return (
      <View key={order.id} style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderId}>#{order.id}</Text>
            <Text style={styles.customerName}>{order.customer}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor}1A` }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{order.status}</Text>
          </View>
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productName}>{order.product} (Qty: {order.quantity})</Text>
          <Text style={styles.amount}>₹{order.amount}</Text>
        </View>

        <View style={styles.addressContainer}>
          <MapPin size={16} color={Colors.textSecondary} />
          <Text style={styles.address}>{order.address}</Text>
        </View>

        <View style={styles.contactContainer}>
          <Phone size={16} color={Colors.textSecondary} />
          <Text style={styles.phone}>{order.phone}</Text>
          {order.distance && (
            <Text style={styles.distance}>{order.distance} away</Text>
          )}
        </View>

        {showActions && (
          <View style={styles.orderActions}>
            {order.status === 'Assigned' && (
                <TouchableOpacity 
                  style={[styles.actionButton, {backgroundColor: Colors.yellow}]}
                  onPress={() => handleStatusUpdate(order.id, 'On the Way')}
                >
                  <Truck size={16} color={Colors.white} />
                  <Text style={styles.actionButtonText}>Start Delivery</Text>
                </TouchableOpacity>
            )}
            {order.status === 'On the Way' && (
                <TouchableOpacity 
                  style={[styles.actionButton, {backgroundColor: Colors.primary}]}
                  onPress={() => handleStatusUpdate(order.id, 'Delivered')}
                >
                  <CheckCircle size={16} color={Colors.white} />
                  <Text style={styles.actionButtonText}>Mark Delivered</Text>
                </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={[Colors.primaryLight, Colors.primary]}
        style={[styles.header, { paddingTop: insets.top + 10 }]}
      >
        <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.headerIcon}>
                <ArrowLeft size={26} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Deliveries</Text>
        </View>
      </LinearGradient>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'assigned' && styles.activeTab]}
          onPress={() => setActiveTab('assigned')}
        >
          <Text style={[styles.tabText, activeTab === 'assigned' && styles.activeTabText]}>
            Assigned ({assignedOrders.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Completed ({completedOrders.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === 'assigned' ? (
          assignedOrders.length > 0 ? (
            assignedOrders.map(order => renderOrderCard(order, true))
          ) : (
            <View style={styles.emptyState}>
              <Package size={64} color={Colors.border} />
              <Text style={styles.emptyStateText}>No assigned orders</Text>
            </View>
          )
        ) : (
          completedOrders.length > 0 ? (
            completedOrders.map(order => renderOrderCard(order, false))
          ) : (
            <View style={styles.emptyState}>
              <CheckCircle size={64} color={Colors.border} />
              <Text style={styles.emptyStateText}>No completed orders</Text>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingBottom: 20,
    paddingHorizontal: 12,
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.primary,
    fontFamily: 'Inter_600SemiBold',
  },
  content: {
    padding: 20,
  },
  orderCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#959DA5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  customerName: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  productName: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: Colors.text,
    flex: 1,
  },
  amount: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: Colors.primary,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  phone: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 12,
    flex: 1,
  },
  distance: {
    fontSize: 13,
    color: Colors.blue,
    fontFamily: 'Inter_600SemiBold',
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  actionButton: {
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.white,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.textSecondary,
    marginTop: 16,
  },
});