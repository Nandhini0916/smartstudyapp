import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

export default function SignupScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return false;
    }
    if (!mobile.trim()) {
      Alert.alert('Error', 'Please enter your mobile number');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const fullMobile = `${countryCode} ${mobile}`;
      const response = await api.post('/auth/register', {
        name,
        email,
        mobile: fullMobile,
        password,
      });
      
      Alert.alert(
        'Success',
        'Account created successfully! Please login.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || 'Signup failed. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={theme.colors.header} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Account</Text>
          <Text style={styles.headerSubtitle}>Join SmartStudy today</Text>
        </LinearGradient>

        <View style={styles.formContainer}>
          <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Ionicons name="person-outline" size={20} color={theme.colors.primary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="Full Name"
              placeholderTextColor={theme.colors.subtext}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Ionicons name="mail-outline" size={20} color={theme.colors.primary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="Email Address"
              placeholderTextColor={theme.colors.subtext}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Ionicons name="call-outline" size={20} color={theme.colors.primary} style={styles.inputIcon} />
            <TextInput
              style={[styles.countryCodeInput, { color: theme.colors.text }]}
              value={countryCode}
              onChangeText={setCountryCode}
              keyboardType="phone-pad"
              maxLength={5}
            />
            <View style={[styles.verticalDivider, { backgroundColor: theme.colors.border }]} />
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="Mobile Number"
              placeholderTextColor={theme.colors.subtext}
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.colors.primary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="Password"
              placeholderTextColor={theme.colors.subtext}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={theme.colors.subtext} />
            </TouchableOpacity>
          </View>

          <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.colors.primary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="Confirm Password"
              placeholderTextColor={theme.colors.subtext}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
            />
          </View>

          <View style={styles.termsContainer}>
            <Text style={[styles.termsText, { color: theme.colors.subtext }]}>
              By signing up, you agree to our{' '}
              <Text style={[styles.termsLink, { color: theme.colors.primary }]}>Terms of Service</Text> and{' '}
              <Text style={[styles.termsLink, { color: theme.colors.primary }]}>Privacy Policy</Text>
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            <LinearGradient colors={theme.colors.header} style={styles.signupGradient}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signupButtonText}>Create Account</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: theme.colors.subtext }]}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={[styles.loginLink, { color: theme.colors.primary }]}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60, paddingBottom: 40, paddingHorizontal: 20,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 14, color: '#fff', opacity: 0.9, marginTop: 8 },
  formContainer: { padding: 24 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 12,
    marginBottom: 16, paddingHorizontal: 16, borderWidth: 1,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, paddingVertical: 14, fontSize: 16 },
  countryCodeInput: { fontSize: 16, minWidth: 35, textAlign: 'center', paddingVertical: 14 },
  verticalDivider: { width: 1, height: 24, marginHorizontal: 12 },
  termsContainer: { marginBottom: 24 },
  termsText: { fontSize: 12, textAlign: 'center', lineHeight: 18 },
  termsLink: { fontWeight: '500' },
  signupButton: { borderRadius: 12, overflow: 'hidden', marginBottom: 20 },
  signupButtonDisabled: { opacity: 0.7 },
  signupGradient: { paddingVertical: 16, alignItems: 'center' },
  signupButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  loginContainer: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { fontSize: 14 },
  loginLink: { fontSize: 14, fontWeight: 'bold' },
});