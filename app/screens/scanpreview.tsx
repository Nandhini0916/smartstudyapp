import React, { useState, Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import * as FileSystem from 'expo-file-system/legacy';

export default function ScanPreviewScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [currentStep, setCurrentStep] = useState(-1);

  const STEPS = ['Uploading image...', 'Running OCR...', 'Detecting content...', 'Done!'];

  const handleProcessImage = async () => {
    if (!photoUri) {
      Alert.alert('Error', 'No image data available. Please retake the photo.');
      return;
    }

    setIsProcessing(true);
    setCurrentStep(0);
    setStatusText(STEPS[0]);

    try {
      // Step 0: Convert URI to Base64 (only when processing starts)
      const base64 = await FileSystem.readAsStringAsync(photoUri, {
        encoding: 'base64',
      });

      // Step progress for UX feedback while API call runs
      const stepTimer1 = setTimeout(() => { setCurrentStep(1); setStatusText(STEPS[1]); }, 1000);
      const stepTimer2 = setTimeout(() => { setCurrentStep(2); setStatusText(STEPS[2]); }, 2500);

      // Call backend vision OCR
      const response = await api.post('/scan/process', {
        base64: base64,
        mimeType: 'image/jpeg',
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      setCurrentStep(3);
      setStatusText(STEPS[3]);

      const { extractedText, type, mathContent } = response.data;

      await new Promise(resolve => setTimeout(resolve, 500));
      setIsProcessing(false);

      if (type !== 'math') {
        Alert.alert(
          '📝 Text Content Detected',
          `We found:\n"${extractedText.slice(0, 150)}${extractedText.length > 150 ? '...' : ''}"\n\nThis doesn't appear to be a math problem. Please scan a math question.`,
          [{ text: 'OK' }]
        );
        return;
      }

      // It's math — navigate to solver
      Alert.alert(
        '📐 Math Problem Detected!',
        `We found:\n"${mathContent || extractedText}"\n\nWould you like to solve this?`,
        [
          {
            text: 'Edit First',
            style: 'cancel',
            onPress: () =>
              router.replace({
                pathname: '/screens/mathsolver',
                params: {
                  scannedQuestion: mathContent || extractedText,
                  photoUri: photoUri as string,
                },
              }),
          },
          {
            text: 'Solve Now',
            onPress: () =>
              router.replace({
                pathname: '/screens/mathsolver',
                params: {
                  scannedQuestion: mathContent || extractedText,
                  photoUri: photoUri as string,
                },
              }),
          },
        ]
      );
    } catch (error: any) {
      setIsProcessing(false);
      setCurrentStep(-1);
      setStatusText('');
      const msg = error.response?.data?.message || 'Failed to process image. Please try again.';
      const details = error.response?.data?.details || error.message;
      Alert.alert('Processing Failed', `${msg}\n\nDetails: ${details}`);
    }
  };

  const handleRetake = () => router.back();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <LinearGradient colors={theme.colors.header} style={styles.header}>
        <TouchableOpacity onPress={handleRetake} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preview</Text>
        <View style={styles.headerPlaceholder} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Preview */}
        {photoUri && (
          <View style={[styles.imageContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Image
              source={{ uri: photoUri as string }}
              style={[styles.previewImage, { backgroundColor: theme.dark ? '#0F172A' : '#f0f0f0' }]}
              resizeMode="contain"
            />
          </View>
        )}

        {/* Processing State */}
        {isProcessing && (
          <View style={[styles.processingContainer, { backgroundColor: theme.colors.card }]}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.processingText, { color: theme.colors.primary }]}>
              {statusText}
            </Text>

            {/* Step progress dots */}
            <View style={styles.progressSteps}>
              {STEPS.map((_, i, arr) => (
                <Fragment key={i}>
                  <View
                    style={[
                      styles.progressDot,
                      i <= currentStep
                        ? [styles.progressDotActive, { backgroundColor: theme.colors.primary }]
                        : { backgroundColor: theme.dark ? '#334155' : '#E0E0E0' },
                    ]}
                  />
                  {i < arr.length - 1 && (
                    <View
                      style={[
                        styles.progressLine,
                        i < currentStep
                          ? { backgroundColor: theme.colors.primary }
                          : { backgroundColor: theme.dark ? '#334155' : '#E0E0E0' },
                      ]}
                    />
                  )}
                </Fragment>
              ))}
            </View>

            <Text style={[styles.stepLabel, { color: theme.colors.subtext }]}>
              Step {Math.max(currentStep + 1, 1)} of {STEPS.length}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.retakeButton,
              { backgroundColor: theme.colors.card, borderColor: theme.colors.primary },
              isProcessing && styles.buttonDisabled,
            ]}
            onPress={handleRetake}
            disabled={isProcessing}
          >
            <Ionicons name="camera-outline" size={22} color={theme.colors.primary} />
            <Text style={[styles.retakeButtonText, { color: theme.colors.primary }]}>Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.processButton, isProcessing && styles.buttonDisabled]}
            onPress={handleProcessImage}
            disabled={isProcessing}
          >
            <LinearGradient
              colors={theme.colors.header}
              style={styles.processGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {isProcessing ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Text style={styles.processButtonText}>Process Question</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Tips */}
        {!isProcessing && (
          <View style={[
            styles.tipsContainer,
            {
              backgroundColor: theme.dark ? theme.colors.card : theme.colors.primary + '10',
              borderColor: theme.colors.primary + '30',
            },
          ]}>
            <View style={styles.tipsTitleRow}>
              <Ionicons name="bulb-outline" size={16} color={theme.colors.primary} />
              <Text style={[styles.tipsTitle, { color: theme.colors.primary }]}>Tips for better results</Text>
            </View>
            {[
              'Ensure good lighting',
              'Hold camera steady',
              'Make sure text is clear and in focus',
              'Avoid shadows on the paper',
            ].map((tip, i) => (
              <View key={i} style={styles.tipRow}>
                <View style={[styles.tipDot, { backgroundColor: theme.colors.primary }]} />
                <Text style={[styles.tipText, { color: theme.colors.subtext }]}>{tip}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
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
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  headerPlaceholder: { width: 40 },
  content: { flex: 1, padding: 20 },
  imageContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  previewImage: {
    width: '100%',
    height: 350,
  },
  processingContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    gap: 6,
  },
  processingText: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '600',
  },
  progressSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  progressDotActive: {
    width: 13,
    height: 13,
    borderRadius: 7,
  },
  progressLine: {
    width: 40,
    height: 2,
    marginHorizontal: 4,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 20,
  },
  retakeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 8,
    elevation: 1,
  },
  retakeButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  processButton: {
    flex: 2,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  processGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 17,
    gap: 10,
  },
  processButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  tipsContainer: {
    borderRadius: 20,
    padding: 18,
    marginTop: 4,
    marginBottom: 10,
    borderWidth: 1,
    gap: 8,
  },
  tipsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  tipsTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tipDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    opacity: 0.7,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 20,
  },
});