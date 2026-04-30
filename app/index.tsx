import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      
      // Small delay for splash effect
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (userToken) {
        router.replace('/(tabs)');
      } else {
        router.replace('/screens/LoginScreen');
      }
    } catch (error) {
      console.error('Auth error:', error);
      router.replace('/screens/LoginScreen');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4A6CF7' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return null;
}