import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Image, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

const TERMS_CONTENT = `
1. Acceptance of Terms
By accessing and using Mentivio, you accept and agree to be bound by the terms and provision of this agreement.

2. Description of Service
Mentivio provides an AI-powered study platform including math solving, text analysis, and vocabulary management.

3. User Conduct
Users are responsible for all content uploaded and must not use the service for any illegal or unauthorized purpose.

4. Intellectual Property
All AI-generated content is for educational purposes. The application core logic and branding are owned by Mentivio.

5. Limitation of Liability
Mentivio shall not be liable for any direct, indirect, or incidental damages resulting from the use of the service.
`;

const PRIVACY_CONTENT = `
1. Data Collection
We collect minimal personal data including name, email, and mobile number to provide personalized study experiences.

2. Document Processing
Documents uploaded for analysis are processed securely. We do not store original files after analysis is complete.

3. AI Integration
We use third-party AI services (like Groq) to process text. Data shared with these services is anonymized where possible.

4. Data Security
We implement industry-standard security measures to protect your data from unauthorized access or disclosure.

5. Your Rights
You can request to delete your account and all associated data at any time via the Support section.
`;

const LICENSES_CONTENT = `
Mentivio is built using the following open-source libraries:

• React & React Native (MIT)
• Expo & Expo Router (MIT)
• Axios (MIT)
• Socket.io (MIT)
• Mongoose (MIT)
• Express (Creative Commons)
• Vector Icons (MIT)
• Lottie React Native (Apache 2.0)
• PDF-Parse (MIT)
• Mammoth.js (BSD-2-Clause)
`;

const { width } = Dimensions.get('window');

export default function AboutScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  const openLegalModal = (title: string, content: string) => {
    setModalTitle(title);
    setModalContent(content);
    setModalVisible(true);
  };

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
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={{ width: width * 0.2, height: width * 0.2, borderRadius: 15 }} 
            resizeMode="contain" 
          />
          <Text style={[styles.appName, { color: theme.colors.text }]}>Mentivio</Text>
          <Text style={[styles.version, { color: theme.colors.subtext }]}>Version 1.0.0</Text>
        </View>

        <View style={[styles.linksContainer, { backgroundColor: theme.colors.card }]}>
          <TouchableOpacity 
            style={styles.linkRow} 
            onPress={() => openLegalModal('Terms of Service', TERMS_CONTENT)}
          >
            <Text style={[styles.linkText, { color: theme.colors.text }]}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
          </TouchableOpacity>
          
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          
          <TouchableOpacity 
            style={styles.linkRow}
            onPress={() => openLegalModal('Privacy Policy', PRIVACY_CONTENT)}
          >
            <Text style={[styles.linkText, { color: theme.colors.text }]}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
          </TouchableOpacity>
          
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          
          <TouchableOpacity 
            style={styles.linkRow}
            onPress={() => openLegalModal('Open Source Licenses', LICENSES_CONTENT)}
          >
            <Text style={[styles.linkText, { color: theme.colors.text }]}>Open Source Licenses</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.copyright, { color: theme.colors.subtext }]}>© 2026 Mentivio. All rights reserved.</Text>
      </View>

      {/* Legal Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalView, { backgroundColor: theme.colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>{modalTitle}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={30} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <Text style={[styles.modalText, { color: theme.colors.subtext }]}>
                {modalContent}
              </Text>
            </ScrollView>
            
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>I Understand</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  copyright: { position: 'absolute', bottom: 40, fontSize: 12 },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalView: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalBody: {
    marginBottom: 20,
  },
  modalText: {
    fontSize: 14,
    lineHeight: 22,
  },
  closeButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
