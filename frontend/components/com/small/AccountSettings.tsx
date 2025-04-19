import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { useTheme } from 'themes/ThemeProvider';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../comView';
import Header from './Header';

type AccountSettingsNavigationProp = StackNavigationProp<RootStackParamList, 'AccountSettings'>;

interface AccountSettingsProps {
  navigation: AccountSettingsNavigationProp;
}

interface SettingsState {
  privateAccount: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  mentionNotifications: boolean;
  showActivity: boolean;
  darkMode: boolean;
}

interface PasswordState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ navigation }) => {
  const { theme } = useTheme();
  
  const [settings, setSettings] = useState<SettingsState>({
    privateAccount: false,
    emailNotifications: true,
    pushNotifications: true,
    mentionNotifications: true,
    showActivity: true,
    darkMode: false,
  });
  
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordState>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const toggleSetting = (setting: keyof SettingsState) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting],
    });
  };
  
  const handleChangePassword = () => {
    // Reset errors
    setPasswordErrors({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    
    // Simple validation
    let hasError = false;
    
    if (!passwordData.currentPassword) {
      setPasswordErrors(prev => ({
        ...prev,
        currentPassword: 'Current password is required',
      }));
      hasError = true;
    }
    
    if (!passwordData.newPassword) {
      setPasswordErrors(prev => ({
        ...prev,
        newPassword: 'New password is required',
      }));
      hasError = true;
    } else if (passwordData.newPassword.length < 8) {
      setPasswordErrors(prev => ({
        ...prev,
        newPassword: 'Password must be at least 8 characters',
      }));
      hasError = true;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordErrors(prev => ({
        ...prev,
        confirmPassword: 'Passwords do not match',
      }));
      hasError = true;
    }
    
    if (!hasError) {
      // In a real app, you would send this to a server
      Alert.alert('Success', 'Password changed successfully');
      setPasswordModalVisible(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: () => {
            // In a real app, you would handle logout logic
            Alert.alert('Logged Out', 'You have been logged out successfully');
            // navigation.navigate('Login'); // Navigate to login screen
          },
          style: 'destructive'
        },
      ]
    );
  };
  
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: () => {
            // In a real app, you would handle account deletion
            Alert.alert('Account Deleted', 'Your account has been deleted successfully');
            // navigation.navigate('Login'); // Navigate to login screen
          },
          style: 'destructive'
        },
      ]
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header 
        title="Account Settings"
        showBack={true}
        showSearch={false}
        showNotification={false}
        showProfile={false}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Account Management Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Account Management
          </Text>
          
          <TouchableOpacity 
            style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <View style={styles.settingInfo}>
              <Icon name="user-edit" size={18} color={theme.colors.textPrimary} style={styles.settingIcon} />
              <Text style={[styles.settingText, { color: theme.colors.textPrimary }]}>
                Edit Profile
              </Text>
            </View>
            <Icon name="chevron-right" size={16} color={theme.colors.textMuted} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}
            onPress={() => setPasswordModalVisible(true)}
          >
            <View style={styles.settingInfo}>
              <Icon name="lock" size={18} color={theme.colors.textPrimary} style={styles.settingIcon} />
              <Text style={[styles.settingText, { color: theme.colors.textPrimary }]}>
                Change Password
              </Text>
            </View>
            <Icon name="chevron-right" size={16} color={theme.colors.textMuted} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}
            onPress={() => navigation.navigate('Preferences')}
          >
            <View style={styles.settingInfo}>
              <Icon name="sliders-h" size={18} color={theme.colors.textPrimary} style={styles.settingIcon} />
              <Text style={[styles.settingText, { color: theme.colors.textPrimary }]}>
                Preferences
              </Text>
            </View>
            <Icon name="chevron-right" size={16} color={theme.colors.textMuted} />
          </TouchableOpacity>
        </View>
        
        {/* Privacy Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Privacy Settings
          </Text>
          
          <View style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingInfo}>
              <Icon name="user-shield" size={18} color={theme.colors.textPrimary} style={styles.settingIcon} />
              <Text style={[styles.settingText, { color: theme.colors.textPrimary }]}>
                Private Account
              </Text>
            </View>
            <Switch
              value={settings.privateAccount}
              onValueChange={() => toggleSetting('privateAccount')}
              trackColor={{ false: "#767577", true: theme.colors.primary }}
              thumbColor={Platform.OS === 'ios' ? undefined : "#f4f3f4"}
              ios_backgroundColor="#767577"
            />
          </View>
          
          <View style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingInfo}>
              <Icon name="eye" size={18} color={theme.colors.textPrimary} style={styles.settingIcon} />
              <Text style={[styles.settingText, { color: theme.colors.textPrimary }]}>
                Show Activity Status
              </Text>
            </View>
            <Switch
              value={settings.showActivity}
              onValueChange={() => toggleSetting('showActivity')}
              trackColor={{ false: "#767577", true: theme.colors.primary }}
              thumbColor={Platform.OS === 'ios' ? undefined : "#f4f3f4"}
              ios_backgroundColor="#767577"
            />
          </View>
        </View>
        
        {/* Notification Preferences */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Notifications
          </Text>
          
          <View style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingInfo}>
              <Icon name="envelope" size={18} color={theme.colors.textPrimary} style={styles.settingIcon} />
              <Text style={[styles.settingText, { color: theme.colors.textPrimary }]}>
                Email Notifications
              </Text>
            </View>
            <Switch
              value={settings.emailNotifications}
              onValueChange={() => toggleSetting('emailNotifications')}
              trackColor={{ false: "#767577", true: theme.colors.primary }}
              thumbColor={Platform.OS === 'ios' ? undefined : "#f4f3f4"}
              ios_backgroundColor="#767577"
            />
          </View>
          
          <View style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingInfo}>
              <Icon name="bell" size={18} color={theme.colors.textPrimary} style={styles.settingIcon} />
              <Text style={[styles.settingText, { color: theme.colors.textPrimary }]}>
                Push Notifications
              </Text>
            </View>
            <Switch
              value={settings.pushNotifications}
              onValueChange={() => toggleSetting('pushNotifications')}
              trackColor={{ false: "#767577", true: theme.colors.primary }}
              thumbColor={Platform.OS === 'ios' ? undefined : "#f4f3f4"}
              ios_backgroundColor="#767577"
            />
          </View>
          
          <View style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingInfo}>
              <Icon name="at" size={18} color={theme.colors.textPrimary} style={styles.settingIcon} />
              <Text style={[styles.settingText, { color: theme.colors.textPrimary }]}>
                Mention Notifications
              </Text>
            </View>
            <Switch
              value={settings.mentionNotifications}
              onValueChange={() => toggleSetting('mentionNotifications')}
              trackColor={{ false: "#767577", true: theme.colors.primary }}
              thumbColor={Platform.OS === 'ios' ? undefined : "#f4f3f4"}
              ios_backgroundColor="#767577"
            />
          </View>
        </View>
        
        {/* Display Options */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Display
          </Text>
          
          <View style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingInfo}>
              <Icon name="moon" size={18} color={theme.colors.textPrimary} style={styles.settingIcon} />
              <Text style={[styles.settingText, { color: theme.colors.textPrimary }]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={settings.darkMode}
              onValueChange={() => toggleSetting('darkMode')}
              trackColor={{ false: "#767577", true: theme.colors.primary }}
              thumbColor={Platform.OS === 'ios' ? undefined : "#f4f3f4"}
              ios_backgroundColor="#767577"
            />
          </View>
        </View>
        
        {/* Account Actions */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.actionButton, { borderColor: theme.colors.border }]}
            onPress={handleLogout}
          >
            <Text style={{ color: theme.colors.textPrimary }}>
              Log Out
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.deleteButton, { borderColor: theme.colors.error }]}
            onPress={handleDeleteAccount}
          >
            <Text style={{ color: theme.colors.error }}>
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Password Change Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={passwordModalVisible}
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.cardBackground }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
                Change Password
              </Text>
              <TouchableOpacity onPress={() => setPasswordModalVisible(false)}>
                <Icon name="times" size={20} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.passwordField}>
                <Text style={[styles.passwordLabel, { color: theme.colors.textMuted }]}>
                  Current Password
                </Text>
                <TextInput
                  style={[
                    styles.passwordInput, 
                    { 
                      color: theme.colors.textPrimary,
                      borderColor: passwordErrors.currentPassword ? theme.colors.error : theme.colors.border,
                      backgroundColor: theme.colors.background,
                    }
                  ]}
                  secureTextEntry
                  value={passwordData.currentPassword}
                  onChangeText={(text) => setPasswordData({...passwordData, currentPassword: text})}
                  placeholder="Enter current password"
                  placeholderTextColor={theme.colors.textMuted}
                />
                {passwordErrors.currentPassword ? (
                  <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {passwordErrors.currentPassword}
                  </Text>
                ) : null}
              </View>
              
              <View style={styles.passwordField}>
                <Text style={[styles.passwordLabel, { color: theme.colors.textMuted }]}>
                  New Password
                </Text>
                <TextInput
                  style={[
                    styles.passwordInput, 
                    { 
                      color: theme.colors.textPrimary,
                      borderColor: passwordErrors.newPassword ? theme.colors.error : theme.colors.border,
                      backgroundColor: theme.colors.background,
                    }
                  ]}
                  secureTextEntry
                  value={passwordData.newPassword}
                  onChangeText={(text) => setPasswordData({...passwordData, newPassword: text})}
                  placeholder="Enter new password"
                  placeholderTextColor={theme.colors.textMuted}
                />
                {passwordErrors.newPassword ? (
                  <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {passwordErrors.newPassword}
                  </Text>
                ) : null}
              </View>
              
              <View style={styles.passwordField}>
                <Text style={[styles.passwordLabel, { color: theme.colors.textMuted }]}>
                  Confirm New Password
                </Text>
                <TextInput
                  style={[
                    styles.passwordInput, 
                    { 
                      color: theme.colors.textPrimary,
                      borderColor: passwordErrors.confirmPassword ? theme.colors.error : theme.colors.border,
                      backgroundColor: theme.colors.background,
                    }
                  ]}
                  secureTextEntry
                  value={passwordData.confirmPassword}
                  onChangeText={(text) => setPasswordData({...passwordData, confirmPassword: text})}
                  placeholder="Re-enter new password"
                  placeholderTextColor={theme.colors.textMuted}
                />
                {passwordErrors.confirmPassword ? (
                  <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {passwordErrors.confirmPassword}
                  </Text>
                ) : null}
              </View>
              
              <TouchableOpacity 
                style={[styles.changePasswordButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleChangePassword}
              >
                <Text style={styles.changePasswordText}>
                  Update Password
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  settingText: {
    fontSize: 15,
  },
  actionButton: {
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteButton: {
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalBody: {
    marginTop: 8,
  },
  passwordField: {
    marginBottom: 16,
  },
  passwordLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  passwordInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  changePasswordButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  changePasswordText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default AccountSettings; 