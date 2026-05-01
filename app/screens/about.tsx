import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

export default function AboutScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient colors={theme.colors.header} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={styles.placeholder} />
      </LinearGradient>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="brain" size={80} color={theme.colors.primary} />
          <Text style={[styles.appName, { color: theme.colors.text }]}>SmartStudyApp</Text>
          <Text style={[styles.version, { color: theme.colors.subtext }]}>Version 1.0.0</Text>
        </View>

        <View style={[styles.linksContainer, { backgroundColor: theme.colors.card }]}>
          <TouchableOpacity style={styles.linkRow}>
            <Text style={[styles.linkText, { color: theme.colors.text }]}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <TouchableOpacity style={styles.linkRow}>
            <Text style={[styles.linkText, { color: theme.colors.text }]}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <TouchableOpacity style={styles.linkRow}>
            <Text style={[styles.linkText, { color: theme.colors.text }]}>Open Source Licenses</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.copyright, { color: theme.colors.subtext }]}>© 2026 SmartStudy. All rights reserved.</Text>
      </View>
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
  content: { flex: 1, padding: 20, alignItems: 'center' },
  logoContainer: { alignItems: 'center', marginTop: 40, marginBottom: 50 },
  appName: { fontSize: 24, fontWeight: 'bold', marginTop: 16 },
  version: { fontSize: 14, marginTop: 4 },
  linksContainer: { width: '100%', borderRadius: 16, paddingHorizontal: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  linkRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  linkText: { fontSize: 16 },
  divider: { height: 1 },
  copyright: { position: 'absolute', bottom: 40, fontSize: 12 }
});
