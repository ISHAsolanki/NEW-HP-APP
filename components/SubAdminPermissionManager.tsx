import { Check, Settings, Shield, User, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Permission, SubAdminData, subAdminService } from '../core/services/subAdminService';

interface SubAdminPermissionManagerProps {
  onClose?: () => void;
}

export const SubAdminPermissionManager: React.FC<SubAdminPermissionManagerProps> = ({ onClose }) => {
  const [subAdmins, setSubAdmins] = useState<SubAdminData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubAdmin, setSelectedSubAdmin] = useState<SubAdminData | null>(null);
  const [editingPermissions, setEditingPermissions] = useState<Permission[]>([]);

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

  const handleEditPermissions = (subAdmin: SubAdminData) => {
    setSelectedSubAdmin(subAdmin);
    setEditingPermissions([...subAdmin.permissions]);
  };

  const togglePermission = (permission: Permission) => {
    setEditingPermissions(prev => {
      if (prev.includes(permission)) {
        return prev.filter(p => p !== permission);
      } else {
        return [...prev, permission];
      }
    });
  };

  const savePermissions = async () => {
    if (!selectedSubAdmin) return;

    try {
      await subAdminService.updateSubAdminPermissions(selectedSubAdmin.uid, editingPermissions);
      
      // Update local state
      setSubAdmins(prev => prev.map(admin => 
        admin.uid === selectedSubAdmin.uid 
          ? { ...admin, permissions: editingPermissions }
          : admin
      ));
      
      setSelectedSubAdmin(null);
      setEditingPermissions([]);
      
      Alert.alert('Success', 'Permissions updated successfully');
    } catch (error) {
      console.error('Error updating permissions:', error);
      Alert.alert('Error', 'Failed to update permissions');
    }
  };

  const cancelEdit = () => {
    setSelectedSubAdmin(null);
    setEditingPermissions([]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={styles.loadingText}>Loading sub-admin data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Shield size={24} color="#7C3AED" />
          <Text style={styles.title}>Sub-Admin Permission Manager</Text>
        </View>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#64748B" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content}>
        {subAdmins.length === 0 ? (
          <View style={styles.emptyState}>
            <User size={48} color="#94A3B8" />
            <Text style={styles.emptyStateText}>No sub-admins found</Text>
            <Text style={styles.emptyStateSubtext}>
              Create sub-admin users first to manage their permissions
            </Text>
          </View>
        ) : (
          subAdmins.map((subAdmin) => (
            <View key={subAdmin.uid} style={styles.subAdminCard}>
              <View style={styles.subAdminHeader}>
                <View style={styles.subAdminInfo}>
                  <User size={20} color="#64748B" />
                  <View style={styles.subAdminDetails}>
                    <Text style={styles.subAdminName}>
                      {subAdmin.displayName || subAdmin.email}
                    </Text>
                    <Text style={styles.subAdminEmail}>{subAdmin.email}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditPermissions(subAdmin)}
                >
                  <Settings size={16} color="#7C3AED" />
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.permissionsContainer}>
                <Text style={styles.permissionsLabel}>Current Permissions:</Text>
                <View style={styles.permissionsList}>
                  {subAdmin.permissions.length === 0 ? (
                    <Text style={styles.noPermissions}>No permissions assigned</Text>
                  ) : (
                    subAdmin.permissions.map((permission) => (
                      <View key={permission} style={styles.permissionTag}>
                        <Text style={styles.permissionText}>
                          {subAdminService.getPermissionDisplayName(permission)}
                        </Text>
                      </View>
                    ))
                  )}
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Permission Edit Modal */}
      {selectedSubAdmin && (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Edit Permissions for {selectedSubAdmin.displayName || selectedSubAdmin.email}
            </Text>
            
            <ScrollView style={styles.permissionOptions}>
              {subAdminService.getAllPermissions().map((permission) => (
                <TouchableOpacity
                  key={permission}
                  style={styles.permissionOption}
                  onPress={() => togglePermission(permission)}
                >
                  <View style={styles.permissionOptionLeft}>
                    <View style={[
                      styles.checkbox,
                      editingPermissions.includes(permission) && styles.checkboxChecked
                    ]}>
                      {editingPermissions.includes(permission) && (
                        <Check size={16} color="#FFFFFF" />
                      )}
                    </View>
                    <Text style={styles.permissionOptionText}>
                      {subAdminService.getPermissionDisplayName(permission)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={cancelEdit}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={savePermissions}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 12,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  subAdminCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  subAdminHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subAdminInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subAdminDetails: {
    marginLeft: 12,
    flex: 1,
  },
  subAdminName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  subAdminEmail: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EDE9FE',
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7C3AED',
    marginLeft: 4,
  },
  permissionsContainer: {
    marginTop: 8,
  },
  permissionsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 8,
  },
  permissionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  permissionTag: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  permissionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7C3AED',
  },
  noPermissions: {
    fontSize: 14,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 20,
    textAlign: 'center',
  },
  permissionOptions: {
    maxHeight: 300,
  },
  permissionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  permissionOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  permissionOptionText: {
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});