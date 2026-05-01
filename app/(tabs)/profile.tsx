import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

export default function ProfileScreen() {
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
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userData');
              router.replace('/screens/LoginScreen');
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        }
      ]
    );
  };

  const menuItems = [
    { icon: 'person-outline', label: 'Edit Profile', color: '#4A6CF7', route: '/screens/editprofile' },
    { icon: 'settings-outline', label: 'Settings', color: '#4A6CF7', route: '/screens/settings' },
    { icon: 'notifications-outline', label: 'Notifications', color: '#4A6CF7', route: '/screens/notifications' },
    { icon: 'help-circle-outline', label: 'Help & Support', color: '#4A6CF7', route: '/screens/support' },
    { icon: 'information-circle-outline', label: 'About', color: '#4A6CF7', route: '/screens/about' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={theme.colors.header} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Student'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          </View>
          
          <View style={[styles.avatar, { backgroundColor: theme.colors.card }]}>
            {user?.profileImage ? (
              <Image source={{ uri: user.profileImage }} style={styles.avatarImage} />
            ) : (
              <Text style={[styles.avatarText, { color: theme.colors.primary }]}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            )}
          </View>
        </View>
      </LinearGradient>

      <View style={{ height: 20 }} />

      <View style={[styles.menuContainer, { backgroundColor: theme.colors.card }]}>
        <View style={[styles.menuHeader, { borderBottomColor: theme.colors.border }]}>
          <Text style={[styles.menuHeaderText, { color: theme.colors.subtext }]}>Account Settings</Text>
        </View>
        
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.menuItem}
            onPress={() => router.push(item.route as any)}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: item.color + '10' }]}>
              <Ionicons name={item.icon as any} size={22} color={item.color} />
            </View>
            <Text style={[styles.menuText, { color: theme.colors.text }]}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
          </TouchableOpacity>
        ))}
        
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={[styles.menuIconContainer, { backgroundColor: '#FF3B3010' }]}>
            <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
          </View>
          <Text style={styles.logoutText}>Logout</Text>
          <Ionicons name="chevron-forward" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginRight: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  menuContainer: {
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  menuHeader: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    marginBottom: 4,
  },
  menuHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  logoutText: {
    flex: 1,
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '500',
  },
  bottomPadding: {
    height: 30,
  },
});