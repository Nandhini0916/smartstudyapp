import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [user, setUser] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const userDataParsed = JSON.parse(userData);
        setUser(userDataParsed);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const features = [
    {
      title: 'Math Solver',
      description: 'Scan or type math problems for step-by-step solutions',
      icon: 'calculator',
      color: '#4A6CF7',
      route: '/screens/mathsolver',
    },
    {
      title: 'Text Analyzer',
      description: 'Extract vocabulary and get summaries from your texts',
      icon: 'text',
      color: '#00C853',
      route: '/screens/textanalysis',
    },
  ];


  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={theme.colors.header} style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Student'}!</Text>
          <Text style={styles.subGreeting}>Ready to learn something new today!</Text>
        </View>

        <TouchableOpacity style={styles.profileIcon} onPress={() => router.push('/(tabs)/profile')}>
          {user?.profileImage ? (
            <Image source={{ uri: user.profileImage }} style={styles.avatarImage} />
          ) : (
            <Ionicons name="person-circle-outline" size={40} color="#fff" />
          )}
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Explore Features</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.featureCard, { backgroundColor: theme.colors.card }]}
              onPress={() => router.push(feature.route as any)}
            >
              <View style={[styles.iconContainer, { backgroundColor: feature.color + '15' }]}>
                <Ionicons name={feature.icon as any} size={28} color={feature.color} />
              </View>
              <Text style={[styles.featureTitle, { color: theme.colors.text }]}>{feature.title}</Text>
              <Text style={[styles.featureDescription, { color: theme.colors.subtext }]}>{feature.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.upgradeCard, { backgroundColor: theme.colors.card }]}>
          <LinearGradient
            colors={['#FF9100', '#FFAB40']}
            style={styles.upgradeGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.upgradeInfo}>
              <Text style={styles.upgradeTitle}>Go Premium</Text>
              <Text style={styles.upgradeText}>Unlock advanced AI features and unlimited study materials.</Text>
            </View>
            <Ionicons name="star" size={32} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subGreeting: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  upgradeCard: {
    marginTop: 10,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#FF9100',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  upgradeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  upgradeInfo: {
    flex: 1,
    marginRight: 10,
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  upgradeText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
});