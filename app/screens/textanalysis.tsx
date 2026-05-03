import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function TextAnalysis() {
  const router = useRouter();
  const { theme } = useTheme();
  const { scannedText, photoUri } = useLocalSearchParams();
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<{ word: string; definition: string; partOfSpeech?: string }[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    if (scannedText) {
      analyzeScannedText(scannedText as string);
    }
  }, [scannedText]);

  const analyzeScannedText = async (text: string) => {
    setAnalyzing(true);
    setFileName('Scanned Text');
    try {
      const response = await api.post('/vocabulary/analyze-text', { text });
      setResults(response.data.results || []);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Analysis Failed', error.response?.data?.message || 'Failed to analyze text');
    } finally {
      setAnalyzing(false);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain'
        ],
        copyToCacheDirectory: true
      });
      
      if (result.canceled) return;

      const asset = result.assets[0];
      setFileName(asset.name);
      setAnalyzing(true);
      setResults([]);

      const formData = new FormData();
      
      // @ts-ignore
      formData.append('document', {
        uri: asset.uri,
        name: asset.name,
        type: asset.mimeType || 'application/octet-stream',
      });

      try {
        const response = await api.post('/documents/analyze', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000, 
        });

        if (response.data) {
          if (response.data.results && Array.isArray(response.data.results)) {
            setResults(response.data.results);
          } else if (response.data.words && Array.isArray(response.data.words)) {
            setResults(response.data.words);
          } else if (Array.isArray(response.data)) {
            setResults(response.data);
          } else {
            console.warn('Unexpected response format:', response.data);
          }
        }
      } catch (error: any) {
        console.error('Upload Error:', error);
        Alert.alert(
          'Upload Failed', 
          error.response?.data?.message || 'Failed to process document. Please try a smaller file.'
        );
        setFileName(null);
      } finally {
        setAnalyzing(false);
      }
    } catch (error) {
      console.error('Picker Error:', error);
      Alert.alert('Error', 'Failed to select document');
      setAnalyzing(false);
    }
  };

  const addToVocabulary = async (item: { word: string; definition: string; partOfSpeech?: string }) => {
    try {
      await api.post('/vocabulary', {
        word: item.word,
        definition: item.definition,
        partOfSpeech: item.partOfSpeech?.toLowerCase() || 'noun',
      });
      Alert.alert('Success', `"${item.word}" has been added to your vocabulary!`);
    } catch (error: any) {
      console.error('Add Vocab Error:', error);
      const msg = error.response?.data?.message || 'Failed to add word';
      Alert.alert('Notice', msg);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient colors={theme.colors.header} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Text Analyzer</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {photoUri && (
          <View style={styles.scannedImageContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons name="image-outline" size={18} color={theme.colors.primary} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Source Image</Text>
            </View>
            <Image 
              source={{ uri: photoUri as string }} 
              style={[styles.scannedImage, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}
              resizeMode="contain"
            />
          </View>
        )}

        <TouchableOpacity 
          style={[styles.uploadCard, analyzing && styles.disabledCard]} 
          onPress={pickDocument}
          disabled={analyzing}
        >
          <LinearGradient
            colors={theme.colors.header}
            style={styles.uploadGradient}
          >
            <View style={[styles.uploadIconCircle, { backgroundColor: '#fff' }]}>
              <Ionicons name="document-text-outline" size={32} color={theme.colors.primary} />
            </View>
            <Text style={styles.uploadText}>
              {fileName ? 'Select Another' : 'Upload Document'}
            </Text>
            <Text style={styles.uploadSubtext}>PDF, DOCX, or TXT (Max 5MB)</Text>
          </LinearGradient>
        </TouchableOpacity>

        {fileName && (
          <View style={[styles.fileInfoBadge, { backgroundColor: theme.colors.primary + '20' }]}>
            <Ionicons name="document-attach-outline" size={16} color={theme.colors.primary} />
            <Text style={[styles.fileNameText, { color: theme.colors.primary }]} numberOfLines={1}>{fileName}</Text>
          </View>
        )}

        {analyzing && (
          <View style={[styles.loadingCard, { backgroundColor: theme.colors.card }]}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.text }]}>Reading document content...</Text>
            <Text style={[styles.loadingSubtext, { color: theme.colors.subtext }]}>Extracting difficult vocabulary with AI</Text>
          </View>
        )}

        {results.length > 0 && (
          <View style={styles.resultsContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons name="bulb-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Difficult Vocabulary Found</Text>
            </View>
            
            {results.map((item, index) => (
              <View key={index} style={[styles.resultCard, { backgroundColor: theme.colors.card }]}>
                <View style={styles.wordHeader}>
                  <Text style={[styles.word, { color: theme.colors.text }]}>{item.word}</Text>
                  {item.partOfSpeech && (
                    <View style={[styles.posBadge, { backgroundColor: theme.colors.primary + '15' }]}>
                      <Text style={[styles.posText, { color: theme.colors.primary }]}>{item.partOfSpeech}</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.definition, { color: theme.colors.subtext }]}>{item.definition}</Text>
                <TouchableOpacity 
                  style={[styles.addButton, { borderTopColor: theme.colors.border }]}
                  onPress={() => addToVocabulary(item)}
                >
                  <Ionicons name="add-circle-outline" size={20} color={theme.colors.primary} />
                  <Text style={[styles.addButtonText, { color: theme.colors.primary }]}>Add to Vocabulary</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {results.length === 0 && !analyzing && !scannedText && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={theme.dark ? '#334155' : '#D1D9FF'} />
            <Text style={[styles.emptyText, { color: theme.colors.subtext }]}>Upload a document to analyze difficult words and improve your vocabulary.</Text>
          </View>
        )}
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
  scrollView: { flex: 1 },
  content: { padding: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  scannedImageContainer: { marginBottom: 20 },
  scannedImage: { width: '100%', height: 180, borderRadius: 16, borderWidth: 1 },
  uploadCard: {
    borderRadius: 24, overflow: 'hidden', marginBottom: 16,
    elevation: 4, shadowColor: '#4A6CF7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8,
  },
  disabledCard: { opacity: 0.7 },
  uploadGradient: { padding: 30, alignItems: 'center' },
  uploadIconCircle: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  uploadText: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  uploadSubtext: { fontSize: 13, color: '#fff', opacity: 0.9, marginTop: 6 },
  fileInfoBadge: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
    alignSelf: 'center', marginBottom: 20, maxWidth: '90%',
  },
  fileNameText: { fontSize: 13, fontWeight: '600', marginLeft: 6 },
  loadingCard: { borderRadius: 20, padding: 30, alignItems: 'center', marginBottom: 20 },
  loadingText: { marginTop: 16, fontSize: 16, fontWeight: 'bold' },
  loadingSubtext: { marginTop: 8, fontSize: 13 },
  resultsContainer: { marginTop: 10 },
  resultCard: { 
    borderRadius: 16, padding: 20, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 
  },
  wordHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  word: { fontSize: 20, fontWeight: 'bold' },
  posBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  posText: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  definition: { fontSize: 15, lineHeight: 22, marginBottom: 16 },
  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 12, borderTopWidth: 1 },
  addButtonText: { fontSize: 14, fontWeight: '600', marginLeft: 6 },
  emptyState: { alignItems: 'center', paddingVertical: 60, opacity: 0.8 },
  emptyText: { fontSize: 15, textAlign: 'center', marginTop: 16, lineHeight: 22, paddingHorizontal: 20 },
});