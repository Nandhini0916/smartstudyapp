import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, isDarkMode, toggleDarkMode } = useTheme();

  const [sounds, setSounds] = React.useState(true);
  const [autoSave, setAutoSave] = React.useState(true);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient colors={theme.colors.header} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </LinearGradient>
      
      <ScrollView style={styles.content}>
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>App Preferences</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon-outline" size={22} color={theme.colors.subtext} />
              <Text style={[styles.settingText, { color: theme.colors.text }]}>Dark Mode</Text>
            </View>
            <Switch 
              value={isDarkMode} 
              onValueChange={toggleDarkMode} 
              trackColor={{ true: theme.colors.primary, false: '#ddd' }} 
            />
          </View>
          
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="volume-high-outline" size={22} color={theme.colors.subtext} />
              <Text style={[styles.settingText, { color: theme.colors.text }]}>Sound Effects</Text>
            </View>
            <Switch value={sounds} onValueChange={setSounds} trackColor={{ true: theme.colors.primary, false: '#ddd' }} />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="save-outline" size={22} color={theme.colors.subtext} />
              <Text style={[styles.settingText, { color: theme.colors.text }]}>Auto-Save Work</Text>
            </View>
            <Switch value={autoSave} onValueChange={setAutoSave} trackColor={{ true: theme.colors.primary, false: '#ddd' }} />
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
