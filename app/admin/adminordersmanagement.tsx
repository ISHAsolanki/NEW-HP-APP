import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Check, Plus, Search, User, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PermissionProtectedRoute } from '../../core/auth/PermissionProtectedRoute';

// --- Color Palette (Matched with other pages) ---
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
  yellow: '#F59E0B',
};

export default function AdminOrdersScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [activeMainTab, setActiveMainTab] = useState('active');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [newOrderData, setNewOrderData] = useState({
      customerName: '',
      phone: '',
      address: '',
      product: null,
      quantity: '1',
  });

  let [fontsLoaded] = useFonts({
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold,
  });
  
  const orders = [
    {
      id: 'ORD001',
      customer: 'John Doe',
      phone: '+91 9876543210',
      product: 'HP Gas 14.2kg',
      quantity: 1,
      amount: 880,
      status: 'Pending',
      orderDate: '20 July 2025',
      address: '123 Main St, City',
      deliveryPersonId: null,
      deliveryPerson: null,
    },
     {
      id: 'ORD004',
      customer: 'Emily White',
      phone: '+91 9876543213',
      product: 'HP Gas 5kg',
      quantity: 1,
      amount: 450,
      status: 'Pending',
      orderDate: '20 July 2025',
      address: '101 Maple Ave, City',
      deliveryPersonId: null,
      deliveryPerson: null,
    },
    {
      id: 'ORD002',
      customer: 'Jane Smith',
      phone: '+91 9876543211',
      product: 'HP Gas 19kg',
      quantity: 2,
      amount: 2500,
      status: 'Out for Delivery',
      orderDate: '19 July 2025',
      address: '456 Oak Ave, City',
      deliveryPersonId: '1',
      deliveryPerson: 'Raj Kumar',
    },
    {
      id: 'ORD003',
      customer: 'Mike Johnson',
      phone: '+91 9876543212',
      product: 'HP Gas 14.2kg',
      quantity: 1,
      amount: 880,
      status: 'Delivered',
      orderDate: '18 July 2025',
      address: '789 Pine St, City',
      deliveryPersonId: '2',
      deliveryPerson: 'Amit Singh',
    },
  ];

  const deliveryAgents = [
      { id: '1', name: 'Raj Kumar', status: 'Available' },
      { id: '2', name: 'Amit Singh', status: 'On Delivery' },
      { id: '3', name: 'Suresh Patel', status: 'Available' },
  ];
  
  const products = [
      { id: '1', name: 'HP Gas 14.2kg', price: 850 },
      { id: '2', name: 'HP Gas 19kg', price: 1200 },
      { id: '3', name: 'HP Gas 5kg', price: 450 },
  ];

  const activeOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Out for Delivery');
  const completedOrders = orders.filter(o => o.status === 'Delivered');

  const filters = [
    { key: 'all', label: 'All Active', count: activeOrders.length },
    { key: 'pending', label: 'Pending', count: activeOrders.filter(o => o.status === 'Pending').length },
    { key: 'delivery', label: 'Out for Delivery', count: activeOrders.filter(o => o.status === 'Out for Delivery').length },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return Colors.green;
      case 'Out for Delivery': return Colors.primary;
      case 'Pending': return Colors.yellow;
      default: return Colors.textSecondary;
    }
  };

  const handleOrderPress = (order) => {
      setSelectedOrder(order);
      setSelectedAgent(order.deliveryPersonId);
      setDetailModalVisible(true);
  }

  const handleOrderLongPress = (order) => {
      if (order.status === 'Pending') {
          setSelectedOrders(prevSelected => 
              prevSelected.includes(order.id)
                  ? prevSelected.filter(id => id !== order.id)
                  : [...prevSelected, order.id]
          );
      }
  }

  const handleBulkAssignPress = () => {
      setSelectedOrder({ id: 'multiple', customer: `${selectedOrders.length} orders selected` });
      setSelectedAgent(null);
      setDetailModalVisible(true);
  }
  
  const handleCreateOrder = () => {
      console.log("Creating order:", newOrderData);
      setCreateModalVisible(false);
      // Reset form
      setNewOrderData({ customerName: '', phone: '', address: '', product: null, quantity: '1' });
  }

  const filteredActiveOrders = selectedFilter === 'all' ? activeOrders : 
    activeOrders.filter(order => {
      switch (selectedFilter) {
        case 'pending': return order.status === 'Pending';
        case 'delivery': return order.status === 'Out for Delivery';
        default: return true;
      }
    });

  if (!fontsLoaded) {
    return <View style={styles.loadingContainer} />;
  }

  const renderOrderList = (orderList) => (
    orderList.map((order) => {
        const isSelected = selectedOrders.includes(order.id);
        return (
        <TouchableOpacity 
            key={order.id} 
            style={[styles.orderCard, isSelected && styles.orderCardSelected, order.status === 'Delivered' && styles.completedOrderCard]} 
            onPress={() => handleOrderPress(order)}
            onLongPress={() => handleOrderLongPress(order)}
        >
          {isSelected && <View style={styles.selectionIndicator}><Check size={14} color={Colors.white} /></View>}
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.orderId}>#{order.id}</Text>
              <Text style={styles.orderDate}>{order.orderDate}</Text>
            </View>
            <Text style={styles.orderAmount}>₹{order.amount}</Text>
          </View>

          <View style={styles.customerInfo}>
            <Text style={styles.productName}>{order.product}</Text>
            <Text style={styles.customerName}>{order.customer}</Text>
            <Text style={styles.customerAddress}>{order.address}</Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.deliveryPerson}>
                {order.deliveryPerson ? `Assigned to: ${order.deliveryPerson}` : 'Unassigned'}
            </Text>
            <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>{order.status}</Text>
          </View>
        </TouchableOpacity>
        )
    })
  );

  return (
    <PermissionProtectedRoute requiredPermission="orders">
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
            <Text style={styles.headerTitle}>Order Management</Text>
        </View>
        <TouchableOpacity onPress={() => setCreateModalVisible(true)} style={styles.headerIcon}>
            <Plus size={26} color={Colors.white} />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Search size={20} color={Colors.textSecondary} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search by Order ID or Customer"
            placeholderTextColor={Colors.textSecondary}
          />
        </View>
      </View>

      <View style={styles.mainTabContainer}>
          <TouchableOpacity style={[styles.mainTab, activeMainTab === 'active' && styles.activeMainTab]} onPress={() => setActiveMainTab('active')}>
              <Text style={[styles.mainTabText, activeMainTab === 'active' && styles.activeMainTabText]}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.mainTab, activeMainTab === 'completed' && styles.activeMainTab]} onPress={() => setActiveMainTab('completed')}>
              <Text style={[styles.mainTabText, activeMainTab === 'completed' && styles.activeMainTabText]}>Completed</Text>
          </TouchableOpacity>
      </View>

      {activeMainTab === 'active' && (
        <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContainer}>
                {filters.map((filter) => (
                <TouchableOpacity
                    key={filter.key}
                    style={[styles.filterChip, selectedFilter === filter.key && styles.activeFilterChip]}
                    onPress={() => setSelectedFilter(filter.key)}
                >
                    <Text style={[styles.filterText, selectedFilter === filter.key && styles.activeFilterText]}>
                    {filter.label}
                    </Text>
                    <Text style={[styles.filterCount, selectedFilter === filter.key && styles.activeFilterCount]}>
                    {filter.count}
                    </Text>
                </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.ordersList}>
        {activeMainTab === 'active' ? renderOrderList(filteredActiveOrders) : renderOrderList(completedOrders)}
      </ScrollView>

      {/* Bulk Assign Footer */}
      {selectedOrders.length > 0 && (
          <View style={[styles.modalFooter, {paddingBottom: insets.bottom + 10}]}>
              <Text style={styles.assignButtonText}>{selectedOrders.length} Order(s) Selected</Text>
              <TouchableOpacity style={styles.assignButton} onPress={handleBulkAssignPress}>
                  <Text style={styles.assignButtonText}>Assign Agent</Text>
              </TouchableOpacity>
          </View>
      )}

      {/* Order Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailModalVisible}
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, {paddingBottom: insets.bottom}]}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Order Details</Text>
                    <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                        <X size={24} color={Colors.textSecondary} />
                    </TouchableOpacity>
                </View>
                {selectedOrder && (
                    <ScrollView>
                        {selectedOrder.id !== 'multiple' && (
                            <>
                            <View style={styles.modalSection}>
                                <View style={styles.modalRow}><Text style={styles.modalLabel}>Order ID:</Text><Text style={styles.modalValue}>#{selectedOrder.id}</Text></View>
                                <View style={styles.modalRow}><Text style={styles.modalLabel}>Product:</Text><Text style={styles.modalValue}>{selectedOrder.product}</Text></View>
                                <View style={styles.modalRow}><Text style={styles.modalLabel}>Order Date:</Text><Text style={styles.modalValue}>{selectedOrder.orderDate}</Text></View>
                                <View style={styles.modalRow}><Text style={styles.modalLabel}>Amount:</Text><Text style={styles.modalValue}>₹{selectedOrder.amount}</Text></View>
                            </View>
                            <View style={styles.modalSection}>
                                <Text style={styles.modalSectionTitle}>Customer Info</Text>
                                <View style={styles.modalRow}><Text style={styles.modalLabel}>Name:</Text><Text style={styles.modalValue}>{selectedOrder.customer}</Text></View>
                                <View style={styles.modalRow}><Text style={styles.modalLabel}>Phone:</Text><Text style={styles.modalValue}>{selectedOrder.phone}</Text></View>
                                <View style={styles.modalRow}><Text style={styles.modalLabel}>Address:</Text><Text style={[styles.modalValue, {textAlign: 'right', flex: 1}]}>{selectedOrder.address}</Text></View>
                            </View>
                            </>
                        )}
                        
                        {selectedOrder.status === 'Delivered' && (
                            <View style={styles.modalSection}>
                                <Text style={styles.modalSectionTitle}>Delivery Details</Text>
                                <View style={styles.modalRow}>
                                    <Text style={styles.modalLabel}>Delivered by:</Text>
                                    <Text style={styles.modalValue}>{selectedOrder.deliveryPerson}</Text>
                                </View>
                            </View>
                        )}

                        {(selectedOrder.status === 'Pending' || selectedOrder.status === 'Out for Delivery' || selectedOrder.id === 'multiple') && (
                            <View style={styles.modalSection}>
                                <Text style={styles.modalSectionTitle}>
                                    {selectedOrder.id === 'multiple' ? `Assign Agent to ${selectedOrders.length} Orders` : 'Assign Delivery Agent'}
                                </Text>
                                {deliveryAgents.map(agent => (
                                    <TouchableOpacity key={agent.id} style={styles.agentRow} onPress={() => setSelectedAgent(agent.id)}>
                                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                                            <User size={18} color={Colors.textSecondary} />
                                            <Text style={styles.agentName}>{agent.name}</Text>
                                        </View>
                                        <View style={[styles.radioOuter, selectedAgent === agent.id && styles.radioSelected]}>
                                            {selectedAgent === agent.id && <View style={styles.radioInner}/>}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </ScrollView>
                )}
                {(selectedOrder?.status === 'Pending' || selectedOrder?.status === 'Out for Delivery' || selectedOrder?.id === 'multiple') && (
                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.assignButton}>
                            <Text style={styles.assignButtonText}>
                                {selectedOrder?.status === 'Out for Delivery' ? 'Update Assignment' : 'Confirm Assignment'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
      </Modal>

      {/* Create Order Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={createModalVisible}
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, {paddingBottom: insets.bottom}]}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Create New Order</Text>
                    <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                        <X size={24} color={Colors.textSecondary} />
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <View style={styles.modalForm}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Customer Name</Text>
                            <TextInput style={styles.input} value={newOrderData.customerName} onChangeText={text => setNewOrderData({...newOrderData, customerName: text})} placeholder="Enter customer name" />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Phone Number</Text>
                            <TextInput style={styles.input} value={newOrderData.phone} onChangeText={text => setNewOrderData({...newOrderData, phone: text})} placeholder="Enter phone number" keyboardType="phone-pad" />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Delivery Address</Text>
                            <TextInput style={[styles.input, {height: 80}]} value={newOrderData.address} onChangeText={text => setNewOrderData({...newOrderData, address: text})} placeholder="Enter full address" multiline />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Select Product</Text>
                            {products.map(product => (
                                <TouchableOpacity key={product.id} style={[styles.productOption, newOrderData.product?.id === product.id && styles.productOptionSelected]} onPress={() => setNewOrderData({...newOrderData, product})}>
                                    <Text style={[styles.productOptionText, newOrderData.product?.id === product.id && styles.productOptionTextSelected]}>{product.name}</Text>
                                    <Text style={[styles.productOptionPrice, newOrderData.product?.id === product.id && styles.productOptionTextSelected]}>₹{product.price}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.modalFooter}>
                    <TouchableOpacity style={styles.assignButton} onPress={handleCreateOrder}>
                        <Text style={styles.assignButtonText}>Create Order</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </Modal>
      </View>
    </PermissionProtectedRoute>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  searchSection: {
    backgroundColor: Colors.surface,
    padding: 20,
    paddingBottom: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    marginLeft: 12,
    fontFamily: 'Inter_400Regular',
  },
  mainTabContainer: {
      flexDirection: 'row',
      backgroundColor: Colors.surface,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderColor: Colors.border,
  },
  mainTab: {
      flex: 1,
      paddingVertical: 14,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
  },
  activeMainTab: {
      borderBottomColor: Colors.primary,
  },
  mainTabText: {
      fontSize: 16,
      fontFamily: 'Inter_500Medium',
      color: Colors.textSecondary,
  },
  activeMainTabText: {
      color: Colors.primary,
      fontFamily: 'Inter_600SemiBold',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeFilterChip: {
    backgroundColor: Colors.primaryLighter,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.textSecondary,
  },
  activeFilterText: {
    color: Colors.primary,
    fontFamily: 'Inter_600SemiBold',
  },
  filterCount: {
      marginLeft: 8,
      fontSize: 12,
      fontFamily: 'Inter_600SemiBold',
      color: Colors.textSecondary,
      backgroundColor: Colors.border,
      paddingHorizontal: 6,
      borderRadius: 8,
  },
  activeFilterCount: {
      color: Colors.primary,
      backgroundColor: Colors.white,
  },
  ordersList: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
    marginBottom: 16,
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
    borderWidth: 2,
    borderColor: 'transparent',
  },
  orderCardSelected: {
      borderColor: Colors.primary,
  },
  completedOrderCard: {
      opacity: 0.8,
  },
  selectionIndicator: {
      position: 'absolute',
      top: 12,
      right: 12,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: Colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
  },
  orderDate: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  orderAmount: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.primary,
  },
  customerInfo: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  productName: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: Colors.text,
    marginBottom: 4,
  },
  customerName: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  customerAddress: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 12,
  },
  deliveryPerson: {
      fontSize: 14,
      fontFamily: 'Inter_400Regular',
      color: Colors.textSecondary,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  // --- Modal Styles ---
  modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
  },
  modalContainer: {
      backgroundColor: Colors.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: '90%',
  },
  modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderColor: Colors.border,
  },
  modalTitle: {
      fontSize: 18,
      fontFamily: 'Inter_600SemiBold',
      color: Colors.text,
  },
  modalForm: {
      padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  productOption: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Colors.border,
      marginBottom: 12,
  },
  productOptionSelected: {
      backgroundColor: Colors.primaryLighter,
      borderColor: Colors.primary,
  },
  productOptionText: {
      fontSize: 16,
      fontFamily: 'Inter_500Medium',
      color: Colors.text,
  },
  productOptionTextSelected: {
      fontFamily: 'Inter_600SemiBold',
      color: Colors.primary,
  },
  productOptionPrice: {
      fontSize: 16,
      fontFamily: 'Inter_500Medium',
      color: Colors.textSecondary,
  },
  modalSection: {
      padding: 20,
  },
  modalSectionTitle: {
      fontSize: 16,
      fontFamily: 'Inter_600SemiBold',
      color: Colors.text,
      marginBottom: 12,
  },
  modalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
  },
  modalLabel: {
      fontSize: 15,
      fontFamily: 'Inter_400Regular',
      color: Colors.textSecondary,
  },
  modalValue: {
      fontSize: 15,
      fontFamily: 'Inter_500Medium',
      color: Colors.text,
  },
  agentRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
  },
  agentName: {
      fontSize: 16,
      fontFamily: 'Inter_500Medium',
      color: Colors.text,
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
  modalFooter: {
      padding: 20,
      borderTopWidth: 1,
      borderColor: Colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  assignButton: {
      backgroundColor: Colors.primary,
      padding: 14,
      borderRadius: 12,
      alignItems: 'center',
      flex: 1,
  },
  assignButtonText: {
      color: Colors.white,
      fontFamily: 'Inter_600SemiBold',
      fontSize: 16,
  }
});