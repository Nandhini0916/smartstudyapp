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
  Animated,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

export default function LoginScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const fadeAnim = useState(new Animated.Value(1))[0];

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      if (response.data.token) {
        const userData = response.data.user;
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        
        Alert.alert('Success', `Welcome ${userData.name}!`, [
          { text: 'OK', onPress: () => router.replace('/(tabs)') }
        ]);
      }
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // NOTE: In a real Expo production app, you would use 'expo-auth-session/providers/google'
      // and provide your Android/iOS Client IDs from the Google Cloud Console.
      
      // Simulating Google Auth Popup for Demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock Google User Data (This would come from the Google Auth response)
      const mockGoogleUser = {
        email: 'demo.user@gmail.com',
        name: 'Demo Student',
        profileImage: 'https://avatar.iran.liara.run/public/boy',
        googleId: 'google_' + Math.random().toString(36).substr(2, 9)
      };

      // Call our backend /auth/google endpoint
      const response = await api.post('/auth/google', mockGoogleUser);

      if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      console.error('Google Sign In Error:', error);
      Alert.alert('Error', 'Google Sign In failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Reset Password',
      'Enter your email to reset password',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send', onPress: () => Alert.alert('Info', 'Password reset link sent!') }
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={theme.colors.header}
          style={styles.header}
        >
          <MaterialCommunityIcons name="brain" size={80} color="#fff" />
          <Text style={styles.appName}>SmartStudy</Text>
          <Text style={styles.tagline}>Learn Smarter with AI</Text>
        </LinearGradient>

        <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
          <Text style={[styles.welcomeText, { color: theme.colors.text }]}>Welcome Back!</Text>
          <Text style={[styles.subtitle, { color: theme.colors.subtext }]}>Sign in to continue learning</Text>

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
              editable={!isLoading}
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
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.rememberContainer}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.checkbox, { borderColor: theme.colors.primary }, rememberMe && { backgroundColor: theme.colors.primary }]}>
                {rememberMe && <Ionicons name="checkmark" size={12} color="#fff" />}
              </View>
              <Text style={[styles.rememberText, { color: theme.colors.subtext }]}>Remember Me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={[styles.forgotText, { color: theme.colors.primary }]}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <LinearGradient
              colors={theme.colors.header}
              style={styles.loginGradient}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
            <Text style={[styles.dividerText, { color: theme.colors.subtext }]}>Or continue with</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
          </View>

          <TouchableOpacity style={[styles.googleButton, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]} onPress={handleGoogleSignIn}>
            <View style={styles.googleIconContainer}>
              <Image 
                source={{ uri: 'https://img.icons8.com/color/48/000000/google-logo.png' }} 
                style={{ width: 24, height: 24 }} 
              />
            </View>
            <Text style={[styles.googleButtonText, { color: theme.colors.text }]}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={[styles.signupText, { color: theme.colors.subtext }]}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/screens/SignupScreen')}>
              <Text style={[styles.signupLink, { color: theme.colors.primary }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1 },
  header: {
    alignItems: 'center', paddingTop: 60, paddingBottom: 40,
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
  },
  appName: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginTop: 12 },
  tagline: { fontSize: 14, color: '#fff', opacity: 0.9, marginTop: 4 },
  formContainer: { flex: 1, paddingHorizontal: 24, paddingTop: 32 },
  welcomeText: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginTop: 8, marginBottom: 24 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 12,
    marginBottom: 16, paddingHorizontal: 16, borderWidth: 1,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, paddingVertical: 14, fontSize: 16 },
  eyeIcon: { padding: 8 },
  optionsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  rememberContainer: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 20, height: 20, borderRadius: 4, borderWidth: 2,
    marginRight: 8, justifyContent: 'center', alignItems: 'center',
  },
  rememberText: { fontSize: 14 },
  forgotText: { fontSize: 14, fontWeight: '500' },
  loginButton: { borderRadius: 12, overflow: 'hidden', marginBottom: 24 },
  loginButtonDisabled: { opacity: 0.7 },
  loginGradient: { paddingVertical: 16, alignItems: 'center' },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 12, fontSize: 12 },
  googleButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 12,
    paddingVertical: 14, paddingHorizontal: 20, marginBottom: 24, borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  googleIconContainer: { marginRight: 12 },
  googleButtonText: { fontSize: 16, fontWeight: '600' },
  signupContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16, marginBottom: 20 },
  signupText: { fontSize: 14 },
  signupLink: { fontSize: 14, fontWeight: 'bold' },
});