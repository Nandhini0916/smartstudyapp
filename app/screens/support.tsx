import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

export default function SupportScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient colors={theme.colors.header} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.placeholder} />
      </LinearGradient>
      
      <ScrollView style={styles.content}>
        <View style={[styles.contactCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Contact Us</Text>
          <Text style={[styles.cardDesc, { color: theme.colors.subtext }]}>Need help with SmartStudyApp? Our team is here for you.</Text>
          
          <TouchableOpacity style={[styles.contactButton, { backgroundColor: theme.colors.primary }]} onPress={() => Linking.openURL('mailto:support@smartstudy.com')}>
            <Ionicons name="mail" size={20} color="#fff" />
            <Text style={styles.contactButtonText}>Email Support</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Frequently Asked Questions</Text>
        
        <View style={[styles.faqCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.faqQ, { color: theme.colors.text }]}>How does the Math Solver work?</Text>
          <Text style={[styles.faqA, { color: theme.colors.subtext }]}>Simply click the camera icon to snap a picture of your math problem, and our backend AI will generate step-by-step solutions for you instantly!</Text>
        </View>

        <View style={[styles.faqCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.faqQ, { color: theme.colors.text }]}>Can I use this app offline?</Text>
          <Text style={[styles.faqA, { color: theme.colors.subtext }]}>Currently, you need an active internet connection to communicate with the backend AI and our databases to fetch solutions and save progress.</Text>
        </View>

        <View style={[styles.faqCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.faqQ, { color: theme.colors.text }]}>How is my data protected?</Text>
          <Text style={[styles.faqA, { color: theme.colors.subtext }]}>We use secure JSON Web Tokens (JWT) for authentication and store your data securely in MongoDB.</Text>
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
  contactCard: { padding: 20, borderRadius: 16, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  cardDesc: { fontSize: 14, marginBottom: 16, lineHeight: 20 },
  contactButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 12, gap: 8 },
  contactButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  faqCard: { padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  faqQ: { fontSize: 15, fontWeight: 'bold', marginBottom: 8 },
  faqA: { fontSize: 14, lineHeight: 20 }
});
