import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

export default function EditProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobile, setMobile] = useState('');
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

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      const fullMobile = `${countryCode} ${mobile}`;
      const response = await api.put('/auth/profile', { name, mobile: fullMobile });
      
      // Update local storage with new user data
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
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <LinearGradient colors={['#4A6CF7', '#6B8CF7']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.placeholder} />
      </LinearGradient>
      <ScrollView style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#4A6CF7" style={{ marginTop: 50 }} />
        ) : (
          <>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.changePhotoText}>Change Photo</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter your name" 
                value={name} 
                onChangeText={setName}
                placeholderTextColor="#999" 
              />

              <Text style={styles.label}>Email Address (Cannot be changed)</Text>
              <TextInput 
                style={[styles.input, styles.disabledInput]} 
                value={email} 
                editable={false}
                placeholderTextColor="#999" 
              />

              <Text style={styles.label}>Mobile Number</Text>
              <View style={styles.mobileInputContainer}>
                <TextInput
                  style={styles.countryCodeInput}
                  value={countryCode}
                  onChangeText={setCountryCode}
                  keyboardType="phone-pad"
                  maxLength={5}
                />
                <View style={styles.verticalDivider} />
                <TextInput 
                  style={[styles.input, { marginBottom: 0, borderWidth: 0, paddingHorizontal: 0 }]} 
                  placeholder="Enter your mobile number" 
                  value={mobile} 
                  onChangeText={setMobile}
                  keyboardType="phone-pad"
                  placeholderTextColor="#999" 
                />
              </View>

              <TouchableOpacity  
                style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} 
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
  container: { flex: 1, backgroundColor: '#F8F9FF' },
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
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#4A6CF7', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 40, fontWeight: 'bold', color: '#fff' },
  changePhotoText: { color: '#4A6CF7', fontSize: 16, fontWeight: '600' },
  formContainer: { backgroundColor: '#fff', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  label: { fontSize: 14, color: '#666', marginBottom: 8, fontWeight: '500' },
  input: { flex: 1, backgroundColor: '#F8F9FF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 14, fontSize: 16, color: '#333', marginBottom: 20 },
  mobileInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, marginBottom: 20, paddingHorizontal: 14 },
  countryCodeInput: { fontSize: 16, color: '#333', minWidth: 35, textAlign: 'center', paddingVertical: 14 },
  verticalDivider: { width: 1, height: 24, backgroundColor: '#E0E0E0', marginHorizontal: 12 },
  disabledInput: { backgroundColor: '#f0f0f0', color: '#888' },
  saveButton: { backgroundColor: '#4A6CF7', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 10 },
  saveButtonDisabled: { opacity: 0.7 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
