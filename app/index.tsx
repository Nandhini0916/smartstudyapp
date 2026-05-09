import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();
  const { theme } = useTheme();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Check Auth and Navigate
    const timer = setTimeout(async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          router.replace('/(tabs)');
        } else {
          router.replace('/screens/LoginScreen');
        }
      } catch (error) {
        console.error('Auth error in splash:', error);
        router.replace('/screens/LoginScreen');
      }
    }, 2500); // 2.5 seconds for full brand exposure

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={theme.colors.header} style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image 
          source={require('../assets/images/logo.png')} 
          style={{ width: width * 0.35, height: width * 0.35, marginBottom: 20, borderRadius: 25 }} 
          resizeMode="contain" 
        />
        <Text style={styles.appName}>Mentivio</Text>
        <Text style={styles.tagline}>Learn Smarter with AI</Text>
      </Animated.View>
      
      <View style={styles.loaderContainer}>
        <Animated.View style={[styles.loader, { opacity: fadeAnim }]} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 8,
    fontWeight: '500',
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 60,
  },
  loader: {
    width: 40,
    height: 40,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
    borderTopColor: '#fff',
    borderRadius: 20,
  },
});