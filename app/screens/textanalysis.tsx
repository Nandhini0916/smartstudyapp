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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import api from '../../services/api';

export default function TextAnalysis() {
  const router = useRouter();
  const { scannedText, photoUri } = useLocalSearchParams();
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<{ word: string; meaning: string }[]>([]);

  useEffect(() => {
    if (scannedText) {
      // If text was scanned from camera, automatically analyze it
      analyzeScannedText(scannedText as string);
    }
  }, [scannedText]);

  const analyzeScannedText = async (text: string) => {
    setAnalyzing(true);
    try {
      const response = await api.post('/vocabulary/analyze-text', { text });
      setResults(response.data.results || []);
      Alert.alert('Success', 'Text analyzed successfully!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to analyze text');
    } finally {
      setAnalyzing(false);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/plain',
      });
      
      if (result.assets && result.assets.length > 0) {
        setAnalyzing(true);
        try {
          const response = await api.post('/vocabulary/analyze-text', { text: 'Simulated document text analysis from file' });
          setResults(response.data.results || []);
          Alert.alert('Success', 'Document analyzed successfully!');
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Failed to analyze document');
        } finally {
          setAnalyzing(false);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to read document');
      setAnalyzing(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#4A6CF7', '#6B8CF7']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Text Analyzer</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <View style={styles.content}>
        {photoUri && (
          <View style={styles.scannedImageContainer}>
            <Text style={styles.scannedLabel}>Scanned Image:</Text>
            <Image 
              source={{ uri: photoUri as string }} 
              style={styles.scannedImage}
              resizeMode="contain"
            />
          </View>
        )}

        {scannedText && (
          <View style={styles.scannedTextContainer}>
            <Text style={styles.scannedLabel}>Detected Text:</Text>
            <Text style={styles.scannedTextContent}>{scannedText as string}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.uploadCard} onPress={pickDocument}>
          <LinearGradient
            colors={['#4A6CF7', '#6B8CF7']}
            style={styles.uploadGradient}
          >
            <Ionicons name="cloud-upload-outline" size={48} color="#fff" />
            <Text style={styles.uploadText}>Upload Document</Text>
            <Text style={styles.uploadSubtext}>Supports .txt files</Text>
          </LinearGradient>
        </TouchableOpacity>

        {analyzing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A6CF7" />
            <Text style={styles.loadingText}>Analyzing document...</Text>
          </View>
        )}

        {results.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Analysis Results</Text>
            {results.map((item, index) => (
              <View key={index} style={styles.resultCard}>
                <Text style={styles.word}>{item.word}</Text>
                <Text style={styles.meaning}>{item.meaning}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: 20,
  },
  scannedImageContainer: {
    marginBottom: 20,
  },
  scannedLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A6CF7',
    marginBottom: 8,
  },
  scannedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  scannedTextContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  scannedTextContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  uploadCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  uploadGradient: {
    padding: 40,
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    color: '#4A6CF7',
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  word: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A6CF7',
    marginBottom: 8,
  },
  meaning: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});