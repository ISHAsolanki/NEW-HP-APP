import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ArrowLeft, ChevronRight, Edit, Lock, LogOut, Trash2, User, Users, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, StatusBar, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../core/auth/AuthContext';
import { FIREBASE_AUTH } from '../../core/firebase/firebase';
import { SubAdminData, subAdminService } from '../../core/services/subAdminService';

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
  red: '#DC2626',
  redLighter: '#FFEBEE',
};



// --- Modal Content Components ---
const EditProfileContent = ({ user }: { user: any }) => {
    const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '' });
    return (
        <View>
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput style={styles.input} value={formData.name} onChangeText={text => setFormData({...formData, name: text})} />
            </View>
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput style={styles.input} value={formData.email} onChangeText={text => setFormData({...formData, email: text})} keyboardType="email-address" autoCapitalize="none" />
            </View>
            <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
        </View>
    );
};

const ChangePasswordContent = () => (
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
        <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Update Password</Text>
        </TouchableOpacity>
    </View>
);

const SubAdminContent = ({ setModalView, setEditingAdmin }: { setModalView: any, setEditingAdmin: any }) => {
    const [subAdmins, setSubAdmins] = useState<SubAdminData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSubAdmins();
    }, []);

    const loadSubAdmins = async () => {
        try {
            setLoading(true);
            const data = await subAdminService.getAllSubAdmins();
            setSubAdmins(data);
        } catch (error) {
            console.error('Error loading sub-admins:', error);
            Alert.alert('Error', 'Failed to load sub-admin data');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (admin: SubAdminData) => {
        setEditingAdmin(admin);
        setModalView('addOrEdit');
    };

    const handleDelete = async (admin: SubAdminData) => {
        Alert.alert(
            'Delete Sub-Admin',
            `Are you sure you want to delete ${admin.displayName || admin.email}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await subAdminService.demoteSubAdmin(admin.uid);
                            await loadSubAdmins(); // Reload the list
                            Alert.alert('Success', 'Sub-admin deleted successfully');
                        } catch (error) {
                            console.error('Error deleting sub-admin:', error);
                            Alert.alert('Error', 'Failed to delete sub-admin');
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading sub-admins...</Text>
            </View>
        );
    }

    return (
        <View>
            {subAdmins.length === 0 ? (
                <View style={styles.emptyState}>
                    <Users size={48} color={Colors.textSecondary} />
                    <Text style={styles.emptyStateText}>No sub-admins found</Text>
                    <Text style={styles.emptyStateSubtext}>Create your first sub-admin to get started</Text>
                </View>
            ) : (
                subAdmins.map(admin => (
                    <View key={admin.uid} style={styles.subAdminCard}>
                        <View style={{flex: 1}}>
                            <Text style={styles.subAdminName}>{admin.displayName || admin.email}</Text>
                            <Text style={styles.subAdminEmail}>{admin.email}</Text>
                            <View style={styles.permissionTags}>
                                {admin.permissions.map(permission => (
                                    <Text key={permission} style={styles.permissionTag}>
                                        {subAdminService.getPermissionDisplayName(permission)}
                                    </Text>
                                ))}
                                {admin.permissions.length === 0 && (
                                    <Text style={styles.noPermissionTag}>No permissions</Text>
                                )}
                            </View>
                        </View>
                        <View style={styles.subAdminActions}>
                            <TouchableOpacity onPress={() => handleEdit(admin)}>
                                <Edit size={18} color={Colors.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDelete(admin)}>
                                <Trash2 size={18} color={Colors.red} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))
            )}
            <TouchableOpacity style={styles.saveButton} onPress={() => { setEditingAdmin(null); setModalView('addOrEdit'); }}>
                <Text style={styles.saveButtonText}>Add New Sub-admin</Text>
            </TouchableOpacity>
        </View>
    );
}

const AddSubAdminContent = ({ editingAdmin, onSuccess }: { editingAdmin: any, onSuccess: () => void }) => {
    const [formData, setFormData] = useState({
        name: editingAdmin?.displayName || '',
        phone: editingAdmin?.phoneNumber || '',
        email: editingAdmin?.email || '',
        password: '',
    });
    const [permissions, setPermissions] = useState(() => {
        const initialPermissions: { [key: string]: boolean } = {};
        subAdminService.getAllPermissions().forEach(permission => {
            initialPermissions[permission] = editingAdmin?.permissions?.includes(permission) || false;
        });
        return initialPermissions;
    });
    const [loading, setLoading] = useState(false);

    const togglePermission = (key: string) => setPermissions(prev => ({...prev, [key]: !prev[key]}));

    const handleSave = async () => {
        if (!formData.name.trim() || !formData.email.trim()) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        if (!editingAdmin && !formData.password.trim()) {
            Alert.alert('Error', 'Password is required for new sub-admin');
            return;
        }

        const selectedPermissions = Object.keys(permissions).filter(key => permissions[key]);

        try {
            setLoading(true);

            if (editingAdmin) {
                // Update existing sub-admin permissions
                await subAdminService.updateSubAdminPermissions(editingAdmin.uid, selectedPermissions);
                Alert.alert('Success', 'Sub-admin updated successfully');
            } else {
                // Create new sub-admin
                const userCredential = await createUserWithEmailAndPassword(
                    FIREBASE_AUTH,
                    formData.email,
                    formData.password
                );

                await subAdminService.createSubAdmin({
                    uid: userCredential.user.uid,
                    email: formData.email,
                    displayName: formData.name,
                    phoneNumber: formData.phone || undefined,
                }, selectedPermissions);

                Alert.alert('Success', 'Sub-admin created successfully');
            }

            onSuccess();
        } catch (error: any) {
            console.error('Error saving sub-admin:', error);
            Alert.alert('Error', error.message || 'Failed to save sub-admin');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View>
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name *</Text>
                <TextInput 
                    style={styles.input} 
                    value={formData.name} 
                    onChangeText={text => setFormData({...formData, name: text})} 
                    placeholder="Enter sub-admin name"
                    editable={!loading}
                />
            </View>
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput 
                    style={styles.input} 
                    value={formData.phone} 
                    onChangeText={text => setFormData({...formData, phone: text})} 
                    placeholder="Enter phone number" 
                    keyboardType="phone-pad"
                    editable={!loading}
                />
            </View>
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email *</Text>
                <TextInput 
                    style={[styles.input, editingAdmin && styles.disabledInput]} 
                    value={formData.email} 
                    onChangeText={text => setFormData({...formData, email: text})} 
                    placeholder="Enter email address" 
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!editingAdmin && !loading}
                />
            </View>
            {!editingAdmin && (
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Password *</Text>
                    <TextInput 
                        style={styles.input} 
                        value={formData.password} 
                        onChangeText={text => setFormData({...formData, password: text})} 
                        placeholder="Create a password" 
                        secureTextEntry
                        editable={!loading}
                    />
                </View>
            )}
            
            <Text style={styles.modalSectionTitle}>Module Access</Text>
            {subAdminService.getAllPermissions().map(permission => (
                <View key={permission} style={styles.permissionRow}>
                    <Text style={styles.permissionLabel}>
                        {subAdminService.getPermissionDisplayName(permission)}
                    </Text>
                    <Switch 
                        value={permissions[permission]} 
                        onValueChange={() => togglePermission(permission)} 
                        trackColor={{false: Colors.border, true: Colors.primaryLight}} 
                        thumbColor={Colors.white}
                        disabled={loading}
                    />
                </View>
            ))}

            <TouchableOpacity 
                style={[styles.saveButton, loading && styles.disabledButton]} 
                onPress={handleSave}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                    <Text style={styles.saveButtonText}>
                        {editingAdmin ? 'Update Sub-admin' : 'Create Sub-admin'}
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default function AdminProfileScreen({ navigation }: { navigation: any }) {
  const insets = useSafeAreaInsets();
  const { userSession, logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalView, setModalView] = useState('list');
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

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
      setModalView('list');
      setEditingAdmin(null);
      setModalVisible(true);
  }

  const handleSubAdminSuccess = () => {
      setModalView('list');
      setEditingAdmin(null);
      setRefreshKey(prev => prev + 1); // Force refresh of SubAdminContent
  }

  const menuItems = [
    { id: '1', title: 'Edit Profile', icon: User, action: () => openModal('editProfile') },
    { id: '2', title: 'Change Password', icon: Lock, action: () => openModal('changePassword') },
    // Only show sub-admin management for full admins
    ...(userSession?.role === 'admin' ? [
      { id: '3', title: 'Sub-admin Management', icon: Users, action: () => openModal('subAdmin') }
    ] : []),
  ];

  if (!fontsLoaded) {
    return <View style={styles.loadingContainer} />;
  }
  
  const renderModalContent = () => {
      switch(modalContent) {
          case 'editProfile': return <EditProfileContent user={userSession} />;
          case 'changePassword': return <ChangePasswordContent />;
          case 'subAdmin': 
            return modalView === 'list' ? 
              <SubAdminContent key={refreshKey} setModalView={setModalView} setEditingAdmin={setEditingAdmin} /> : 
              <AddSubAdminContent editingAdmin={editingAdmin} onSuccess={handleSubAdminSuccess} />;
          default: return null;
      }
  }
  
  const getModalTitle = () => {
      if (modalContent === 'subAdmin') {
          if (modalView === 'list') return 'Sub-admin Management';
          return editingAdmin ? 'Edit Sub-admin' : 'Add New Sub-admin';
      }
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
                <LogOut size={20} color={Colors.red} />
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
                    {modalView !== 'list' && modalContent === 'subAdmin' && (
                        <TouchableOpacity onPress={() => setModalView('list')} style={styles.modalBack}>
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
  menuContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#959DA5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
    shadowColor: '#959DA5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutIcon: {
    backgroundColor: Colors.redLighter,
  },
  logoutText: {
    color: Colors.red,
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
  subAdminCard: {
      backgroundColor: Colors.background,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  subAdminName: {
      fontSize: 16,
      fontFamily: 'Inter_600SemiBold',
      color: Colors.text,
  },
  subAdminEmail: {
      fontSize: 14,
      fontFamily: 'Inter_400Regular',
      color: Colors.textSecondary,
  },
  subAdminActions: {
      flexDirection: 'row',
      gap: 16,
  },
  permissionTags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 8,
  },
  permissionTag: {
      backgroundColor: Colors.primaryLighter,
      color: Colors.primary,
      fontSize: 12,
      fontFamily: 'Inter_500Medium',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
  },
  modalSectionTitle: {
      fontSize: 16,
      fontFamily: 'Inter_600SemiBold',
      color: Colors.text,
      marginBottom: 8,
  },
  permissionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
  },
  permissionLabel: {
      fontSize: 16,
      fontFamily: 'Inter_500Medium',
      color: Colors.text,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: Colors.textSecondary,
    marginTop: 12,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.textSecondary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  noPermissionTag: {
    backgroundColor: Colors.border,
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontStyle: 'italic',
  },
  disabledInput: {
    backgroundColor: Colors.border,
    color: Colors.textSecondary,
  },
  disabledButton: {
    backgroundColor: Colors.textSecondary,
  },
});

