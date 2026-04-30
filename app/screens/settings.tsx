import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function SettingsScreen() {
  const router = useRouter();

  const [darkMode, setDarkMode] = React.useState(false);
  const [sounds, setSounds] = React.useState(true);
  const [autoSave, setAutoSave] = React.useState(true);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4A6CF7', '#6B8CF7']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </LinearGradient>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon-outline" size={22} color="#666" />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ true: '#4A6CF7', false: '#ddd' }} />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="volume-high-outline" size={22} color="#666" />
              <Text style={styles.settingText}>Sound Effects</Text>
            </View>
            <Switch value={sounds} onValueChange={setSounds} trackColor={{ true: '#4A6CF7', false: '#ddd' }} />
          </View>

          <View style={styles.divider} />
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="save-outline" size={22} color="#666" />
              <Text style={styles.settingText}>Auto-Save Work</Text>
            </View>
            <Switch value={autoSave} onValueChange={setAutoSave} trackColor={{ true: '#4A6CF7', false: '#ddd' }} />
          </View>
        </View>
      </View>
    </View>
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
  section: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  settingInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingText: { fontSize: 16, color: '#444' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 8 }
});
