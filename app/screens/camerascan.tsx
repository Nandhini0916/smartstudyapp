import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

export default function CameraScanScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);

  const takePicture = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is needed to scan questions.');
        return;
      }

      setIsProcessing(true);

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        router.push({
          pathname: '/screens/scanpreview',
          params: {
            photoUri: result.assets[0].uri,
            photoBase64: result.assets[0].base64 || '',
          },
        });
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to capture question. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const pickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Need gallery access to select images');
        return;
      }

      setIsProcessing(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        router.push({
          pathname: '/screens/scanpreview',
          params: {
            photoUri: result.assets[0].uri,
            photoBase64: result.assets[0].base64 || '',
          },
        });
      }
    } catch (error) {
      console.error('Gallery error:', error);
      Alert.alert('Error', 'Failed to select image');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <LinearGradient colors={theme.colors.header} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitleRow}>
          <MaterialCommunityIcons name="camera-iris" size={22} color="#fff" />
          <Text style={styles.headerTitle}>Scan Question</Text>
        </View>
        <View style={styles.headerPlaceholder} />
      </LinearGradient>

      <View style={styles.content}>
        {/* Camera Preview Area */}
        <View style={[styles.cameraPlaceholder, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={[styles.cameraIconRing, { borderColor: theme.colors.primary + '40', backgroundColor: theme.colors.primary + '15' }]}>
            <MaterialCommunityIcons name="camera-iris" size={64} color={theme.colors.primary} />
          </View>
          <Text style={[styles.placeholderText, { color: theme.colors.text }]}>Camera will open when you tap</Text>
          <Text style={[styles.placeholderSubtext, { color: theme.colors.subtext }]}>
            Take a photo or select from gallery
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.cameraButton, { backgroundColor: theme.colors.primary }]}
            onPress={takePicture}
            disabled={isProcessing}
          >
            <Ionicons name="camera" size={24} color="#fff" />
            <Text style={styles.cameraButtonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.galleryButton, {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.primary,
            }]}
            onPress={pickFromGallery}
            disabled={isProcessing}
          >
            <Ionicons name="images" size={24} color={theme.colors.primary} />
            <Text style={[styles.galleryButtonText, { color: theme.colors.primary }]}>
              Choose from Gallery
            </Text>
          </TouchableOpacity>
        </View>

        {/* Processing Indicator */}
        {isProcessing && (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.processingText, { color: theme.colors.primary }]}>Processing...</Text>
          </View>
        )}

        {/* Tips Section */}
        <View style={[styles.tipsContainer, {
          backgroundColor: theme.dark ? theme.colors.card : theme.colors.primary + '10',
          borderColor: theme.colors.primary + '30',
        }]}>
          <View style={styles.tipsTitleRow}>
            <Ionicons name="bulb-outline" size={16} color={theme.colors.primary} />
            <Text style={[styles.tipsTitle, { color: theme.colors.primary }]}>Tips for best results</Text>
          </View>
          {[
            'Ensure good lighting',
            'Hold camera steady',
            'Make sure text is clear',
            'Avoid shadows on the paper',
          ].map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <View style={[styles.tipDot, { backgroundColor: theme.colors.primary }]} />
              <Text style={[styles.tipText, { color: theme.colors.subtext }]}>{tip}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  headerPlaceholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  cameraPlaceholder: {
    flex: 1,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    minHeight: 280,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  cameraIconRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '600',
  },
  placeholderSubtext: {
    fontSize: 13,
    fontWeight: '400',
  },
  buttonContainer: {
    gap: 14,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 17,
    borderRadius: 18,
    gap: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cameraButton: {},
  cameraButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  galleryButton: {
    borderWidth: 1.5,
    elevation: 0,
  },
  galleryButtonText: {
    fontSize: 17,
    fontWeight: '700',
  },
  processingContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  processingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tipsContainer: {
    borderRadius: 20,
    padding: 18,
    marginTop: 'auto',
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
    fontWeight: '400',
    lineHeight: 20,
  },
});