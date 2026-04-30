import React, { useState } from 'react';
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

export default function ScanPreviewScreen() {
  const router = useRouter();
  const { photoUri, photoBase64 } = useLocalSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [detectedType, setDetectedType] = useState<'math' | 'text' | null>(null);

  // Improved function to detect if content is math or text
  const detectContentType = (text: string): 'math' | 'text' => {
    // Remove extra spaces and convert to lowercase
    const cleanText = text.toLowerCase().trim();
    
    // Math-specific patterns (more strict)
    const mathPatterns = [
      /[0-9]+[\+\-\*\/\=][0-9]+/,           // Basic arithmetic: 2+2, 5-3
      /[0-9]+x[\+\-\=]/,                     // Terms: 2x+, 3x=
      /x[\^2]?[\+\-\=]/,                     // Variables: x², x+
      /[0-9]+[x][\^]?[0-9]?/,               // 2x, 2x²
      /\([^)]+\)[\+\-\*\/\=]/,               // Parentheses with operators
      /[\+\-\*\/\=][0-9]+[x]?/,              // Operators with numbers/variables
      /(sin|cos|tan|log|ln)\s*\(/i,          // Trig functions
      /(integral|derivative|d\/dx|dy\/dx)/i, // Calculus terms
      /(equation|solve for|find x)/i,        // Math keywords
      /[0-9]+[\.]?[0-9]*[\+\-\*\/][0-9]+/,  // Decimal arithmetic: 2.5+3.2
      /\=[0-9]+/,                            // Equals sign with number
      /[a-z]\^[0-9]/,                        // Variable with exponent: x^2
      /[0-9]+\^[0-9]+/,                      // Number exponent: 2^3
      /sqrt\s*\(/,                           // Square root
      /pi|π/,                                // Pi symbol
    ];
    
    // Math score counter
    let mathScore = 0;
    let textScore = 0;
    
    // Check for math patterns
    for (const pattern of mathPatterns) {
      if (pattern.test(cleanText)) {
        mathScore++;
      }
    }
    
    // Text-specific patterns
    const textPatterns = [
      /\b(the|and|for|with|from|have|this|that|these|those)\b/i,  // Common English words
      /\b(is|are|was|were|be|been|being)\b/i,                     // Being verbs
      /\b(to|of|in|on|at|by|for|with|without)\b/i,               // Prepositions
      /\b(a|an|the)\b/i,                                          // Articles
      /\b[.,!?;:]/,                                              // Punctuation
      /[a-zA-Z]{5,}\s+[a-zA-Z]{5,}/,                             // Multiple long words
      /\b\w{8,}\b/,                                              // Long words (8+ letters)
    ];
    
    // Check for text patterns
    for (const pattern of textPatterns) {
      if (pattern.test(cleanText)) {
        textScore++;
      }
    }
    
    // Calculate text length and word count
    const words = cleanText.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / wordCount;
    
    // If many words and average length is typical for English (4-8 characters)
    if (wordCount > 5 && avgWordLength > 3 && avgWordLength < 9) {
      textScore++;
    }
    
    // Check for math symbols
    const mathSymbols = (cleanText.match(/[\+\-\*\/\=\^\(\)]/g) || []).length;
    if (mathSymbols >= 2) {
      mathScore++;
    }
    
    // Check for numbers
    const numbers = (cleanText.match(/[0-9]/g) || []).length;
    if (numbers >= 2) {
      mathScore++;
    }
    
    // Decision logic
    if (mathScore >= 2 && mathScore > textScore) {
      return 'math';
    }
    
    // If there's an equals sign with math pattern
    if (cleanText.includes('=') && mathScore >= 1) {
      return 'math';
    }
    
    // If there's a variable like x or y and numbers
    if (/[a-z]/.test(cleanText) && numbers >= 1 && !cleanText.includes('the')) {
      return 'math';
    }
    
    return 'text';
  };

  const handleProcessImage = async () => {
    setIsProcessing(true);
    
    // Simulate OCR processing with animation steps
    const steps = [
      'Analyzing image...',
      'Detecting text...',
      'Recognizing content...',
      'Identifying question type...',
    ];
    
    for (let i = 0; i < steps.length; i++) {
      setExtractedText(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    // In a real app, this would come from OCR
    // For demo, let's use different examples based on what was scanned
    
    // You can replace this with actual OCR result
    // For now, let's use a text example to test detection
    const mockMathProblem = '2x² + 5x - 3 = 0';
    const mockTextContent = 'The quick brown fox jumps over the lazy dog.';
    
    // For testing, use text content to demonstrate correct detection
    // In production, this would be the actual OCR result
    const detectedContent = mockTextContent; // Change to mockMathProblem for math test
    
    setExtractedText(`Extracted: ${detectedContent}`);
    
    // Detect content type with improved logic
    const contentType = detectContentType(detectedContent);
    setDetectedType(contentType);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setIsProcessing(false);
    
    // Show appropriate alert based on detected type
    if (contentType !== 'math') {
      Alert.alert(
        'Invalid Content',
        'Please scan only math problems. Text analysis is not supported from this scanner.',
        [{ text: 'OK' }]
      );
      return;
    }

    const alertTitle = '📐 Math Problem Detected!';
    const alertMessage = `We found: ${detectedContent}\n\nWould you like to solve this math problem?`;
    
    Alert.alert(
      alertTitle,
      alertMessage,
      [
        { 
          text: 'Edit', 
          style: 'cancel',
          onPress: () => {
            router.push({
              pathname: '/screens/mathsolver',
              params: { 
                scannedQuestion: detectedContent,
                photoUri: photoUri as string
              }
            });
          }
        },
        { 
          text: 'Solve Now', 
          onPress: () => {
            router.push({
              pathname: '/screens/mathsolver',
              params: { 
                scannedQuestion: detectedContent,
                photoUri: photoUri as string
              }
            });
          }
        }
      ]
    );
  };

  const handleRetake = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4A6CF7', '#6B8CF7']} style={styles.header}>
        <TouchableOpacity onPress={handleRetake} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preview</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content}>
        {photoUri && (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: photoUri as string }} 
              style={styles.previewImage}
              resizeMode="contain"
            />
          </View>
        )}

        {isProcessing && (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#4A6CF7" />
            <Text style={styles.processingText}>{extractedText || 'Processing image...'}</Text>
            <View style={styles.progressSteps}>
              <View style={[styles.progressDot, extractedText.includes('Analyzing') && styles.progressDotActive]} />
              <View style={[styles.progressLine, extractedText.includes('Detecting') && styles.progressLineActive]} />
              <View style={[styles.progressDot, extractedText.includes('Detecting') && styles.progressDotActive]} />
              <View style={[styles.progressLine, extractedText.includes('Recognizing') && styles.progressLineActive]} />
              <View style={[styles.progressDot, extractedText.includes('Recognizing') && styles.progressDotActive]} />
              <View style={[styles.progressLine, extractedText.includes('Identifying') && styles.progressLineActive]} />
              <View style={[styles.progressDot, extractedText.includes('Identifying') && styles.progressDotActive]} />
            </View>
            {detectedType && (
              <View style={styles.detectionBadge}>
                <Text style={styles.detectionText}>
                  {detectedType === 'math' ? '📐 Math Problem Detected' : '📝 Text Content Detected'}
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.retakeButton, isProcessing && styles.buttonDisabled]} 
            onPress={handleRetake}
            disabled={isProcessing}
          >
            <Ionicons name="camera-outline" size={24} color="#4A6CF7" />
            <Text style={styles.retakeButtonText}>Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.processButton, isProcessing && styles.buttonDisabled]}
            onPress={handleProcessImage}
            disabled={isProcessing}
          >
            <LinearGradient
              colors={['#4A6CF7', '#6B8CF7']}
              style={styles.processGradient}
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

        {!isProcessing && (
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 Tips for better results:</Text>
            <Text style={styles.tipText}>• Ensure good lighting</Text>
            <Text style={styles.tipText}>• Hold camera steady</Text>
            <Text style={styles.tipText}>• Make sure text is clear</Text>
            <Text style={styles.tipText}>• Avoid shadows on the paper</Text>
          </View>
        )}
      </ScrollView>
    </View>
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
    flex: 1,
    padding: 20,
  },
  imageContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  previewImage: {
    width: '100%',
    height: 350,
    backgroundColor: '#f0f0f0',
  },
  processingContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
  },
  processingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#4A6CF7',
    fontWeight: '500',
  },
  progressSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
  },
  progressDotActive: {
    backgroundColor: '#4A6CF7',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  progressLineActive: {
    backgroundColor: '#4A6CF7',
  },
  detectionBadge: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F0F3FF',
    borderRadius: 20,
  },
  detectionText: {
    fontSize: 12,
    color: '#4A6CF7',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 20,
  },
  retakeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4A6CF7',
    gap: 8,
  },
  retakeButtonText: {
    color: '#4A6CF7',
    fontSize: 16,
    fontWeight: '600',
  },
  processButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  processGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  processButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tipsContainer: {
    backgroundColor: '#F0F3FF',
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A6CF7',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
    marginLeft: 8,
  },
});