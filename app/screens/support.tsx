import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function SupportScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4A6CF7', '#6B8CF7']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.placeholder} />
      </LinearGradient>
      <ScrollView style={styles.content}>
        <View style={styles.contactCard}>
          <Text style={styles.cardTitle}>Contact Us</Text>
          <Text style={styles.cardDesc}>Need help with SmartStudyApp? Our team is here for you.</Text>
          
          <TouchableOpacity style={styles.contactButton} onPress={() => Linking.openURL('mailto:support@smartstudy.com')}>
            <Ionicons name="mail" size={20} color="#fff" />
            <Text style={styles.contactButtonText}>Email Support</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        
        <View style={styles.faqCard}>
          <Text style={styles.faqQ}>How does the Math Solver work?</Text>
          <Text style={styles.faqA}>Simply click the camera icon to snap a picture of your math problem, and our backend AI will generate step-by-step solutions for you instantly!</Text>
        </View>

        <View style={styles.faqCard}>
          <Text style={styles.faqQ}>Can I use this app offline?</Text>
          <Text style={styles.faqA}>Currently, you need an active internet connection to communicate with the backend AI and our databases to fetch solutions and save progress.</Text>
        </View>

        <View style={styles.faqCard}>
          <Text style={styles.faqQ}>How is my data protected?</Text>
          <Text style={styles.faqA}>We use secure JSON Web Tokens (JWT) for authentication and store your data securely in MongoDB.</Text>
        </View>
      </ScrollView>
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
  contactCard: { backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  cardDesc: { fontSize: 14, color: '#666', marginBottom: 16, lineHeight: 20 },
  contactButton: { backgroundColor: '#4A6CF7', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 12, gap: 8 },
  contactButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  faqCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  faqQ: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  faqA: { fontSize: 14, color: '#666', lineHeight: 20 }
});
