import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  ActivityIndicator, 
  Alert,
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

export default function EditProfileScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobile, setMobile] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageBase64, setProfileImageBase64] = useState<string | null>(null);
  const [initials, setInitials] = useState('U');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        setName(user.name || '');
        setEmail(user.email || '');
        setProfileImage(user.profileImage || null);
        
        if (user.mobile) {
          const parts = user.mobile.split(' ');
          if (parts.length > 1 && parts[0].startsWith('+')) {
            setCountryCode(parts[0]);
            setMobile(parts.slice(1).join(' '));
          } else {
            setMobile(user.mobile);
          }
        }
        
        if (user.name) {
          setInitials(user.name.charAt(0).toUpperCase());
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickImage = async () => {
    Alert.alert(
      'Profile Photo',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Choose from Gallery', onPress: handleLaunchLibrary },
        { text: 'Take Photo', onPress: handleLaunchCamera },
      ]
    );
  };

  const handleLaunchCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera permissions to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2,
      base64: true,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      if (result.assets[0].base64) {
        setProfileImageBase64(`data:image/jpeg;base64,${result.assets[0].base64}`);
      }
    }
  };

  const handleLaunchLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to change your photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2, 
      base64: true,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      if (result.assets[0].base64) {
        setProfileImageBase64(`data:image/jpeg;base64,${result.assets[0].base64}`);
      }
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      const fullMobile = `${countryCode} ${mobile}`;
      const response = await api.put('/auth/profile', { 
        name, 
        mobile: fullMobile,
        profileImage: profileImageBase64 || profileImage 
      });
      
      const updatedUser = response.data.user;
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error('Update error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient colors={theme.colors.header} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.placeholder} />
      </LinearGradient>
      
      <ScrollView style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
        ) : (
          <>
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8}>
                <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
                  {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                  ) : (
                    <Text style={styles.avatarText}>{initials}</Text>
                  )}
                  <View style={[styles.cameraIconBadge, { backgroundColor: theme.colors.secondary }]}>
                    <Ionicons name="camera" size={16} color="#fff" />
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePickImage}>
                <Text style={[styles.changePhotoText, { color: theme.colors.primary }]}>Change Photo</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.formContainer, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.label, { color: theme.colors.subtext }]}>Full Name</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]} 
                placeholder="Enter your name" 
                value={name} 
                onChangeText={setName}
                placeholderTextColor={theme.colors.subtext} 
              />

              <Text style={[styles.label, { color: theme.colors.subtext }]}>Email Address</Text>
              <TextInput 
                style={[styles.input, styles.disabledInput, { backgroundColor: theme.dark ? '#1e293b' : '#f0f0f0', borderColor: theme.colors.border, color: theme.colors.subtext }]} 
                value={email} 
                editable={false}
                placeholderTextColor={theme.colors.subtext} 
              />

              <Text style={[styles.label, { color: theme.colors.subtext }]}>Mobile Number</Text>
              <View style={[styles.mobileInputContainer, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                <TextInput
                  style={[styles.countryCodeInput, { color: theme.colors.text }]}
                  value={countryCode}
                  onChangeText={setCountryCode}
                  keyboardType="phone-pad"
                  maxLength={5}
                />
                <View style={[styles.verticalDivider, { backgroundColor: theme.colors.border }]} />
                <TextInput 
                  style={[styles.input, { marginBottom: 0, borderWidth: 0, paddingHorizontal: 0, color: theme.colors.text }]} 
                  placeholder="Enter mobile number" 
                  value={mobile} 
                  onChangeText={setMobile}
                  keyboardType="phone-pad"
                  placeholderTextColor={theme.colors.subtext} 
                />
              </View>

              <TouchableOpacity  
                style={[styles.saveButton, { backgroundColor: theme.colors.primary }, isSaving && styles.saveButtonDisabled]} 
                onPress={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  placeholder: { width: 40 },
  content: { flex: 1, padding: 20 },
  avatarContainer: { alignItems: 'center', marginTop: 20, marginBottom: 30 },
  avatar: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 12,
    position: 'relative'
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarText: { fontSize: 40, fontWeight: 'bold', color: '#fff' },
  cameraIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff'
  },
  changePhotoText: { fontSize: 16, fontWeight: '600' },
  formContainer: { 
    borderRadius: 16, padding: 20, 
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 
  },
  label: { fontSize: 14, marginBottom: 8, fontWeight: '500' },
  input: { flex: 1, borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 20 },
  mobileInputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, marginBottom: 20, paddingHorizontal: 14 },
  countryCodeInput: { fontSize: 16, minWidth: 35, textAlign: 'center', paddingVertical: 14 },
  verticalDivider: { width: 1, height: 24, marginHorizontal: 12 },
  disabledInput: { opacity: 0.8 },
  saveButton: { borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 10 },
  saveButtonDisabled: { opacity: 0.7 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
