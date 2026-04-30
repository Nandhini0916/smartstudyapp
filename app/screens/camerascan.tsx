import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

export default function CameraScanScreen() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const takePicture = async () => {
    try {
      // Request camera permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is needed to scan questions.');
        return;
      }

      setIsProcessing(true);

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        console.log('Photo taken:', result.assets[0].uri);
        
        // Navigate to scan preview screen
        router.push({
          pathname: '/screens/scanpreview',
          params: { 
            photoUri: result.assets[0].uri,
            photoBase64: result.assets[0].base64 || ''
          }
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
            photoBase64: result.assets[0].base64 || ''
          }
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
    <View style={styles.container}>
      <LinearGradient colors={['#4A6CF7', '#6B8CF7']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Question</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <View style={styles.content}>
        {/* Camera Preview Placeholder */}
        <View style={styles.cameraPlaceholder}>
          <MaterialCommunityIcons name="camera-iris" size={80} color="#ccc" />
          <Text style={styles.placeholderText}>Camera will open when you tap</Text>
          <Text style={styles.placeholderSubtext}>Take a photo or select from gallery</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.cameraButton]} 
            onPress={takePicture}
            disabled={isProcessing}
          >
            <Ionicons name="camera" size={28} color="#fff" />
            <Text style={styles.actionButtonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.galleryButton]} 
            onPress={pickFromGallery}
            disabled={isProcessing}
          >
            <Ionicons name="images" size={28} color="#4A6CF7" />
            <Text style={[styles.actionButtonText, styles.galleryButtonText]}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>

        {isProcessing && (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#4A6CF7" />
            <Text style={styles.processingText}>Processing...</Text>
          </View>
        )}

        {/* Tips Section */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Tips for best results:</Text>
          <Text style={styles.tipText}>• Ensure good lighting</Text>
          <Text style={styles.tipText}>• Hold camera steady</Text>
          <Text style={styles.tipText}>• Make sure text is clear</Text>
          <Text style={styles.tipText}>• Avoid shadows on the paper</Text>
        </View>
      </View>
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
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    minHeight: 300,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 8,
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  cameraButton: {
    backgroundColor: '#4A6CF7',
  },
  galleryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4A6CF7',
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  galleryButtonText: {
    color: '#4A6CF7',
  },
  processingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  processingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#4A6CF7',
  },
  tipsContainer: {
    backgroundColor: '#F0F3FF',
    borderRadius: 16,
    padding: 16,
    marginTop: 'auto',
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