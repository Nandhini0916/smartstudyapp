import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useCallback } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState('Student');

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.name) {
          // Get first name only if there are spaces
          const firstName = user.name.split(' ')[0];
          setUserName(firstName);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const quickActions = [
    { 
      id: 1, 
      icon: 'calculator-outline', 
      label: 'Math Solver', 
      color: '#4A6CF7', 
      screen: '/screens/mathsolver' 
    },
    { 
      id: 2, 
      icon: 'document-text', 
      label: 'Text Analyzer', 
      color: '#10B981', 
      screen: '/screens/textanalysis' 
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#4A6CF7', '#6B8CF7']} style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {userName}!</Text>
          <Text style={styles.subGreeting}>Ready to learn something new today!</Text>
        </View>
        <TouchableOpacity style={styles.profileIcon}>
          <Ionicons name="person-circle-outline" size={40} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.cardsContainer}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={() => router.push(action.screen as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: action.color + '15' }]}>
                <Ionicons name={action.icon as any} size={36} color={action.color} />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subGreeting: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 16,
  },
  cardsContainer: {
    flexDirection: 'column',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});