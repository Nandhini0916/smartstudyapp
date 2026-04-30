import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import socketService from '../../services/socket';

export default function MathSolver() {
  const router = useRouter();
  const { scannedQuestion, photoUri } = useLocalSearchParams();
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');

  useEffect(() => {
    if (scannedQuestion && scannedQuestion !== 'true') {
      // If scannedQuestion contains the actual problem text
      setProblem(scannedQuestion as string);
    } else if (scannedQuestion === 'true' && photoUri) {
      Alert.alert(
        'Question Captured!',
        'Your question has been captured. Enter the problem or wait for AI processing.',
        [{ text: 'OK' }]
      );
    }
    
    const socket = socketService.connect();
    socket.on('math-solution', (data: any) => {
      setSolution(data.solution);
    });
    
    return () => {
      socket.off('math-solution');
    };
  }, [scannedQuestion, photoUri]);

  const handleSolve = () => {
    if (!problem.trim()) {
      Alert.alert('Error', 'Please enter a math problem');
      return;
    }
    
    setSolution('Solving...');
    const socket = socketService.connect();
    socket.emit('math-query', { problem });
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#4A6CF7', '#6B8CF7']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Math Solver</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <View style={styles.content}>
        {photoUri && (
          <View style={styles.scannedImageContainer}>
            <Text style={styles.scannedLabel}>Captured Question:</Text>
            <Image 
              source={{ uri: photoUri as string }} 
              style={styles.scannedImage}
              resizeMode="contain"
            />
          </View>
        )}

        <View style={styles.inputCard}>
          <Text style={styles.label}>Enter your math problem</Text>
          <TextInput
            style={styles.input}
            placeholder="Example: 2x² + 5x - 3 = 0"
            placeholderTextColor="#999"
            value={problem}
            onChangeText={setProblem}
            multiline
          />
          
          <TouchableOpacity style={styles.cameraButton} onPress={() => router.push('/screens/camerascan')}>
            <Ionicons name="camera-outline" size={20} color="#4A6CF7" />
            <Text style={styles.cameraButtonText}>Scan Question</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.solveButton} onPress={handleSolve}>
            <LinearGradient colors={['#4A6CF7', '#6B8CF7']} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Solve Problem</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {solution ? (
          <View style={styles.solutionCard}>
            <Text style={styles.solutionTitle}>Solution</Text>
            <Text style={styles.solutionText}>{solution}</Text>
          </View>
        ) : null}
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
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#F5F5F8',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4A6CF7',
    backgroundColor: '#fff',
  },
  cameraButtonText: {
    color: '#4A6CF7',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  solveButton: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  solutionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  solutionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A6CF7',
    marginBottom: 12,
  },
  solutionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
});