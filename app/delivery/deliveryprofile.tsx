import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, ChevronRight, Lock, LogOut, User, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../core/auth/AuthContext';

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
};



// --- Modal Content Components ---
const EditProfileContent = ({ user }: { user: any }) => {
    const [formData, setFormData] = useState({ 
        name: user?.displayName || '', 
        phone: user?.phoneNumber || '', 
        email: user?.email || '' 
    });
    return (
        <View>
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput style={styles.input} value={formData.name} onChangeText={text => setFormData({...formData, name: text})} />
            </View>
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput style={styles.input} value={formData.phone} onChangeText={text => setFormData({...formData, phone: text})} keyboardType="phone-pad" />
            </View>
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput style={styles.input} value={formData.email} onChangeText={text => setFormData({...formData, email: text})} keyboardType="email-address" />
            </View>
            <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
        </View>
    );
};

const ChangePasswordContent = ({ onForgotPassword }) => (
    <View>
        <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current Password</Text>
            <TextInput style={styles.input} secureTextEntry />
        </View>
        <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>New Password</Text>
            <TextInput style={styles.input} secureTextEntry />
        </View>
        <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm New Password</Text>
            <TextInput style={styles.input} secureTextEntry />
        </View>
        <TouchableOpacity style={styles.forgotPasswordButton} onPress={onForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Update Password</Text>
        </TouchableOpacity>
    </View>
);

const ForgotPasswordContent = () => (
    <View>
        <Text style={styles.infoValue}>Enter your registered email to receive a password reset link.</Text>
        <View style={[styles.inputGroup, {marginTop: 20}]}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput style={styles.input} keyboardType="email-address" autoCapitalize="none" />
        </View>
        <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Send Reset Link</Text>
        </TouchableOpacity>
    </View>
);

export default function DeliveryAgentProfileScreen() {
  const insets = useSafeAreaInsets();
  const { userSession, logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalView, setModalView] = useState('');

  let [fontsLoaded] = useFonts({
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold,
  });

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const openModal = (contentKey: string) => {
      setModalContent(contentKey);
      setModalView(contentKey); // Set initial view
      setModalVisible(true);
  }

  const menuItems = [
    { id: '1', title: 'Edit Profile', icon: User, action: () => openModal('editProfile') },
    { id: '2', title: 'Change Password', icon: Lock, action: () => openModal('changePassword') },
  ];

  if (!fontsLoaded) {
    return <View style={styles.loadingContainer} />;
  }
  
  const renderModalContent = () => {
      switch(modalView) {
          case 'editProfile': return <EditProfileContent user={userSession} />;
          case 'changePassword': return <ChangePasswordContent onForgotPassword={() => setModalView('forgotPassword')} />;
          case 'forgotPassword': return <ForgotPasswordContent />;
          default: return null;
      }
  }
  
  const getModalTitle = () => {
      if (modalView === 'forgotPassword') return 'Forgot Password';
      const item = menuItems.find(item => item.action.toString().includes(modalContent));
      return item ? item.title : '';
  }

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
            <Text style={styles.headerTitle}>My Profile</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Info Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userSession?.displayName || 'Delivery Agent'}</Text>
            <Text style={styles.profileEmail}>{userSession?.email || ''}</Text>
            <Text style={styles.profileRole}>Delivery Agent</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, index === menuItems.length - 1 && { borderBottomWidth: 0 }]}
                onPress={item.action}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIcon}>
                    <item.icon size={20} color={Colors.primary} />
                  </View>
                  <Text style={styles.menuText}>
                    {item.title}
                  </Text>
                </View>
                <ChevronRight size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            ))}
        </View>

        <TouchableOpacity
            style={[styles.menuItem, styles.logoutItem]}
            onPress={handleLogout}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, styles.logoutIcon]}>
                <LogOut size={20} color={Colors.primary} />
              </View>
              <Text style={[styles.menuText, styles.logoutText]}>
                Logout
              </Text>
            </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Generic Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, {paddingBottom: insets.bottom}]}>
                <View style={styles.modalHeader}>
                    {modalView === 'forgotPassword' && (
                        <TouchableOpacity onPress={() => setModalView('changePassword')} style={styles.modalBack}>
                            <ArrowLeft size={24} color={Colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                    <Text style={styles.modalTitle}>{getModalTitle()}</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <X size={24} color={Colors.textSecondary} />
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <View style={styles.modalForm}>
                        {renderModalContent()}
                    </View>
                </ScrollView>
            </View>
        </View>
      </Modal>
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
  profileSection: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  profileInfo: {
    padding: 20,
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  profileRole: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.primary,
    backgroundColor: Colors.primaryLighter,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  menuContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: Colors.text,
  },
  logoutItem: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderBottomWidth: 0,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  logoutIcon: {
    backgroundColor: Colors.primaryLighter,
  },
  logoutText: {
    color: Colors.primary,
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
  modalBack: {
      position: 'absolute',
      left: 20,
      padding: 4,
  },
  modalTitle: {
      fontSize: 18,
      fontFamily: 'Inter_600SemiBold',
      color: Colors.text,
      textAlign: 'center',
      flex: 1,
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
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.white,
  },
  forgotPasswordButton: {
      alignSelf: 'flex-end',
      paddingVertical: 8,
  },
  forgotPasswordText: {
      color: Colors.primary,
      fontFamily: 'Inter_500Medium',
  },
  infoValue: {
      fontSize: 16,
      fontFamily: 'Inter_400Regular',
      color: Colors.textSecondary,
      lineHeight: 22,
  },
});
