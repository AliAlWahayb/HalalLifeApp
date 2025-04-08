import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useTheme } from 'themes/ThemeProvider';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../comView';
import Header from './Header';

type EditProfileNavigationProp = StackNavigationProp<RootStackParamList, 'EditProfile'>;

interface EditProfileProps {
  navigation: EditProfileNavigationProp;
}

interface UserData {
  username: string;
  handle: string;
  bio: string;
  location: string;
  profileImage: string;
  email: string;
  phone: string;
}

const EditProfile: React.FC<EditProfileProps> = ({ navigation }) => {
  const { theme } = useTheme();
  
  // Initial user data - in a real app, this would come from an API or context
  const [userData, setUserData] = useState<UserData>({
    username: 'John Doe',
    handle: '@johndoe',
    bio: 'Food enthusiast | Travel lover | Photographer',
    location: 'New York, NY',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
  });
  
  // Track if anything has changed to enable/disable the save button
  const [hasChanges, setHasChanges] = useState(false);
  
  const updateField = (field: keyof UserData, value: string) => {
    setUserData({ ...userData, [field]: value });
    setHasChanges(true);
  };
  
  const handleSave = () => {
    // In a real app, you would save the changes to a server here
    Alert.alert('Success', 'Profile updated successfully!');
    setHasChanges(false);
    navigation.goBack();
  };
  
  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard your changes?',
        [
          { text: 'No', style: 'cancel' },
          { 
            text: 'Yes', 
            onPress: () => navigation.goBack(),
            style: 'destructive'
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };
  
  const handleChangePhoto = () => {
    // In a real app, you would implement image picking here
    Alert.alert('Feature Coming Soon', 'Photo upload will be available in the next update.');
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header 
        title="Edit Profile"
        showBack={true}
        onBackPress={handleCancel}
        showSearch={false}
        showNotification={false}
        showProfile={false}
        customRightComponent={
          <TouchableOpacity 
            style={[
              styles.saveButton, 
              { 
                backgroundColor: hasChanges ? theme.colors.primary : theme.colors.disabled,
              }
            ]}
            onPress={handleSave}
            disabled={!hasChanges}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        }
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Image */}
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: userData.profileImage }} 
              style={styles.profileImage} 
            />
            <TouchableOpacity 
              style={[styles.changePhotoButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleChangePhoto}
            >
              <Icon name="camera" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          {/* Form fields */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.textMuted }]}>
                Name
              </Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    color: theme.colors.textPrimary,
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.cardBackground,
                  }
                ]}
                value={userData.username}
                onChangeText={(text) => updateField('username', text)}
                placeholderTextColor={theme.colors.textMuted}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.textMuted }]}>
                Username
              </Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    color: theme.colors.textPrimary,
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.cardBackground,
                  }
                ]}
                value={userData.handle}
                onChangeText={(text) => updateField('handle', text)}
                placeholderTextColor={theme.colors.textMuted}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.textMuted }]}>
                Bio
              </Text>
              <TextInput
                style={[
                  styles.textArea, 
                  { 
                    color: theme.colors.textPrimary,
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.cardBackground,
                  }
                ]}
                value={userData.bio}
                onChangeText={(text) => updateField('bio', text)}
                placeholderTextColor={theme.colors.textMuted}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.textMuted }]}>
                Location
              </Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    color: theme.colors.textPrimary,
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.cardBackground,
                  }
                ]}
                value={userData.location}
                onChangeText={(text) => updateField('location', text)}
                placeholderTextColor={theme.colors.textMuted}
              />
            </View>
            
            <View style={styles.sectionDivider} />
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.textMuted }]}>
                Email
              </Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    color: theme.colors.textPrimary,
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.cardBackground,
                  }
                ]}
                value={userData.email}
                onChangeText={(text) => updateField('email', text)}
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.textMuted }]}>
                Phone
              </Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    color: theme.colors.textPrimary,
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.cardBackground,
                  }
                ]}
                value={userData.phone}
                onChangeText={(text) => updateField('phone', text)}
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingTop: 15,
    fontSize: 16,
    height: 100,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: 20,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default EditProfile; 