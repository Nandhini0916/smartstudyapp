import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';

export default function NotificationsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { 
    pushNotifications, setPushNotifications,
    emailAlerts, setEmailAlerts,
    featureAnnouncements, setFeatureAnnouncements 
  } = useSettings();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient colors={theme.colors.header} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.placeholder} />
      </LinearGradient>
      
      <ScrollView style={styles.content}>
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Alert Preferences</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={22} color={theme.colors.subtext} />
              <Text style={[styles.settingText, { color: theme.colors.text }]}>Push Notifications</Text>
            </View>
            <Switch value={pushNotifications} onValueChange={setPushNotifications} trackColor={{ true: theme.colors.primary, false: '#ddd' }} />
          </View>
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="mail-outline" size={22} color={theme.colors.subtext} />
              <Text style={[styles.settingText, { color: theme.colors.text }]}>Email Alerts</Text>
            </View>
            <Switch value={emailAlerts} onValueChange={setEmailAlerts} trackColor={{ true: theme.colors.primary, false: '#ddd' }} />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card, marginTop: 20 }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Updates & Reports</Text>
          

          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="sparkles-outline" size={22} color={theme.colors.subtext} />
              <Text style={[styles.settingText, { color: theme.colors.text }]}>New Feature Announcements</Text>
            </View>
            <Switch value={featureAnnouncements} onValueChange={setFeatureAnnouncements} trackColor={{ true: theme.colors.primary, false: '#ddd' }} />
          </View>
        </View>
      </ScrollView>
    </View>
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
  section: {
    borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  settingInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingText: { fontSize: 16 },
  divider: { height: 1, marginVertical: 8 }
});
