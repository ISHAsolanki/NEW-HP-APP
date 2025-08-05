import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, Clock, Package, Star, BarChart2 as TrendingUp } from 'lucide-react-native';
import React from 'react';
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
  green: '#16A34A',
};

export default function DeliverySummaryScreen() {
  const insets = useSafeAreaInsets();

  let [fontsLoaded] = useFonts({
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold,
  });

  const todayStats = {
    totalDeliveries: 8,
    completedDeliveries: 6,
    pendingDeliveries: 2,
    earnings: 480,
  };

  const recentDeliveries = [
    { id: 'ORD001', customer: 'John Doe', time: '2:30 PM', earnings: 60, rating: 5 },
    { id: 'ORD002', customer: 'Jane Smith', time: '1:45 PM', earnings: 80, rating: 4 },
    { id: 'ORD003', customer: 'Mike Johnson', time: '12:15 PM', earnings: 60, rating: 5 },
  ];

  if (!fontsLoaded) {
    return <View style={styles.loadingContainer} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={[Colors.primaryLight, Colors.primary]}
        style={[styles.header, { paddingTop: insets.top + 10 }]}
      >
        <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Delivery Dashboard</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Performance</Text>
            <View style={styles.statsGrid}>
                <View style={styles.statCard}><View style={styles.statIconContainer}><Package size={24} color={Colors.primary} /></View><Text style={styles.statValue}>{todayStats.totalDeliveries}</Text><Text style={styles.statLabel}>Total Orders</Text></View>
                <View style={styles.statCard}><View style={styles.statIconContainer}><CheckCircle size={24} color={Colors.primary} /></View><Text style={styles.statValue}>{todayStats.completedDeliveries}</Text><Text style={styles.statLabel}>Completed</Text></View>
                <View style={styles.statCard}><View style={styles.statIconContainer}><Clock size={24} color={Colors.primary} /></View><Text style={styles.statValue}>{todayStats.pendingDeliveries}</Text><Text style={styles.statLabel}>Pending</Text></View>
                <View style={styles.statCard}><View style={styles.statIconContainer}><TrendingUp size={24} color={Colors.primary} /></View><Text style={styles.earningsValue}>₹{todayStats.earnings}</Text><Text style={styles.statLabel}>Earnings</Text></View>
            </View>
        </View>

        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Deliveries</Text>
                <TouchableOpacity>
                    <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.deliveryListContainer}>
                {recentDeliveries.map((delivery, index) => (
                <View key={delivery.id} style={[styles.deliveryCard, index === recentDeliveries.length - 1 && {borderBottomWidth: 0}]}>
                    <View style={[styles.statIconContainer, {marginRight: 16}]}>
                        <Package size={20} color={Colors.primary} />
                    </View>
                    <View style={styles.deliveryInfo}>
                    <Text style={styles.deliveryCustomer}>{delivery.customer}</Text>
                    <Text style={styles.deliveryTime}>Delivered at {delivery.time}</Text>
                    </View>
                    <View style={styles.deliveryRight}>
                    <Text style={styles.deliveryEarnings}>₹{delivery.earnings}</Text>
                    <View style={styles.ratingContainer}>
                        <Star size={12} color={Colors.yellow} fill={Colors.yellow} />
                        <Text style={styles.ratingText}>{delivery.rating}</Text>
                    </View>
                    </View>
                </View>
                ))}
            </View>
        </View>
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
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    shadowColor: '#959DA5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: Colors.primaryLighter,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-start',
  },
  statValue: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
    marginTop: 8,
    marginBottom: 2,
    alignSelf: 'flex-start',
  },
  earningsValue: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
    marginTop: 8,
    marginBottom: 2,
    alignSelf: 'flex-start',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.textSecondary,
    alignSelf: 'flex-start',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.primary,
  },
  deliveryListContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  deliveryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryCustomer: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
    marginBottom: 2,
  },
  deliveryTime: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  deliveryRight: {
    alignItems: 'flex-end',
  },
  deliveryEarnings: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.yellow,
    marginLeft: 4,
  },
});
