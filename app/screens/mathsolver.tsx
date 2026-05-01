import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
  Animated,
  Dimensions,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import socketService from '../../services/socket';
import { useTheme } from '../../context/ThemeContext';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

export default function MathSolver() {
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();
  const { scannedQuestion, photoUri } = useLocalSearchParams();
  const [problem, setProblem] = useState('');
  const [isSolving, setIsSolving] = useState(false);
  const [steps, setSteps] = useState<string[]>([]);
  const [formula, setFormula] = useState('');
  const [hint, setHint] = useState('');
  const [status, setStatus] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadUserId();
    if (scannedQuestion && scannedQuestion !== 'true') {
      setProblem(scannedQuestion as string);
    }
    
    const socket = socketService.connect();
    
    socket.on('math-processing', (data: any) => {
      setStatus('Analyzing problem...');
    });

    socket.on('math-step', (data: any) => {
      setSteps(prev => [...prev, data.content]);
      setStatus(`Calculating step ${data.step}...`);
      
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    socket.on('math-complete', (data: any) => {
      setIsSolving(false);
      setStatus('Solved!');
      if (data.formula) setFormula(data.formula);
      if (data.hint) setHint(data.hint);
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    });

    socket.on('math-error', (data: any) => {
      setIsSolving(false);
      setStatus('');
      Alert.alert('Error', data.message || 'Failed to solve problem');
    });

    socket.on('math-solution', (data: any) => {
      setIsSolving(false);
      setSteps([data.solution]);
      setStatus('Solved!');
    });
    
    return () => {
      socket.off('math-processing');
      socket.off('math-step');
      socket.off('math-complete');
      socket.off('math-error');
      socket.off('math-solution');
    };
  }, [scannedQuestion, photoUri]);

  const loadUserId = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.id || user._id) setUserId(user.id || user._id);
      }
    } catch (error) {
      console.error('Error loading user ID:', error);
    }
  };

  const handleSolve = () => {
    if (!problem.trim()) {
      Alert.alert('Error', 'Please enter a math problem');
      return;
    }
    
    Keyboard.dismiss();
    setSteps([]);
    setFormula('');
    setHint('');
    setIsSolving(true);
    setStatus('Sending to AI Tutor...');
    fadeAnim.setValue(0);
    slideAnim.setValue(20);
    
    const socket = socketService.connect();
    socket.emit('math-query', { problem, userId });
  };

  const handleClear = () => {
    setProblem('');
    setSteps([]);
    setFormula('');
    setHint('');
    setStatus('');
    setIsSolving(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Dynamic Header */}
      <LinearGradient colors={theme.colors.header} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <MaterialCommunityIcons name="calculator-variant" size={24} color="#fff" />
            <Text style={styles.headerTitle}>Math Tutor AI</Text>
          </View>
          <TouchableOpacity onPress={handleClear} style={styles.iconButton}>
            <Ionicons name="refresh" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Scanned Image Preview - Modern Floating Style */}
        {photoUri && (
          <View style={[styles.previewContainer, { shadowColor: theme.colors.primary }]}>
            <Image 
              source={{ uri: photoUri as string }} 
              style={styles.previewImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.previewOverlay}
            >
              <Text style={styles.previewText}>Question from Camera</Text>
            </LinearGradient>
          </View>
        )}

        {/* Premium Input Card */}
        <View style={[styles.inputCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.inputHeader}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Question Input</Text>
            <View style={[styles.aiBadge, { backgroundColor: theme.colors.primary + '20' }]}>
              <Ionicons name="sparkles" size={12} color={theme.colors.primary} />
              <Text style={[styles.aiBadgeText, { color: theme.colors.primary }]}>AI ACTIVE</Text>
            </View>
          </View>
          
          <TextInput
            style={[styles.input, { backgroundColor: theme.dark ? '#0F172A' : '#F8FAFF', color: theme.colors.text, borderColor: theme.colors.border }]}
            placeholder="Type your problem here..."
            placeholderTextColor={theme.colors.subtext}
            value={problem}
            onChangeText={setProblem}
            multiline
            editable={!isSolving}
          />
          
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.dark ? '#1E293B' : '#F1F5F9' }]} 
              onPress={() => router.push('/screens/camerascan')}
              disabled={isSolving}
            >
              <Ionicons name="camera" size={20} color={theme.colors.primary} />
              <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>Scan</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.mainSolveButton, isSolving && styles.disabledButton]} 
              onPress={handleSolve}
              disabled={isSolving}
            >
              <LinearGradient 
                colors={theme.colors.header} 
                style={styles.solveGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {isSolving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Text style={styles.solveText}>Solve Now</Text>
                    <Ionicons name="chevron-forward" size={18} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Solution Visualization */}
        {(isSolving || steps.length > 0) && (
          <View style={styles.solutionSection}>
            <View style={styles.sectionDivider}>
              <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
              <Text style={[styles.dividerLabel, { color: theme.colors.subtext }]}>SOLUTION PATH</Text>
              <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
            </View>

            {formula ? (
              <Animated.View style={[styles.formulaBox, { backgroundColor: theme.colors.primary + '10', borderColor: theme.colors.primary, opacity: fadeAnim }]}>
                <Ionicons name="medal-outline" size={24} color={theme.colors.primary} />
                <View style={styles.formulaContent}>
                  <Text style={[styles.formulaHeader, { color: theme.colors.primary }]}>Master Formula</Text>
                  <Text style={[styles.formulaValue, { color: theme.colors.text }]}>{formula}</Text>
                </View>
              </Animated.View>
            ) : null}

            {steps.map((step, index) => (
              <Animated.View 
                key={index} 
                style={[
                  styles.stepCard,
                  { backgroundColor: theme.colors.card, transform: [{ translateY: slideAnim }] }
                ]}
              >
                <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepText, { color: theme.colors.text }]}>{step}</Text>
                </View>
                <Ionicons name="checkmark-done" size={18} color={theme.colors.primary} opacity={0.5} />
              </Animated.View>
            ))}

            {status && isSolving && (
              <View style={styles.pulseContainer}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text style={[styles.pulseText, { color: theme.colors.primary }]}>{status}</Text>
              </View>
            )}

            {hint && !isSolving && (
              <Animated.View style={[styles.hintBox, { opacity: fadeAnim }]}>
                <BlurView intensity={theme.dark ? 20 : 40} style={styles.blurHint}>
                  <View style={styles.hintHeader}>
                    <Ionicons name="bulb" size={20} color="#FFB300" />
                    <Text style={styles.hintTitle}>STUDY TIP</Text>
                  </View>
                  <Text style={[styles.hintBody, { color: theme.dark ? '#E2E8F0' : '#475569' }]}>{hint}</Text>
                </BlurView>
              </Animated.View>
            )}
          </View>
        )}
        
        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60, paddingBottom: 25, paddingHorizontal: 20,
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
    elevation: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 15
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20 },
  previewContainer: {
    height: 180, borderRadius: 24, overflow: 'hidden', marginBottom: 25,
    elevation: 8, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15
  },
  previewImage: { width: '100%', height: '100%' },
  previewOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, justifyContent: 'flex-end', padding: 15 },
  previewText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  inputCard: { 
    borderRadius: 28, padding: 22, marginBottom: 25,
    elevation: 5, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15 
  },
  inputHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  inputLabel: { fontSize: 16, fontWeight: '700' },
  aiBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, gap: 5 },
  aiBadgeText: { fontSize: 10, fontWeight: '900' },
  input: { borderRadius: 20, padding: 18, fontSize: 18, minHeight: 120, textAlignVertical: 'top', borderWidth: 1 },
  actionGrid: { flexDirection: 'row', marginTop: 18, gap: 12 },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18, borderRadius: 18, height: 55 },
  actionButtonText: { fontWeight: '700', fontSize: 14 },
  mainSolveButton: { flex: 1, height: 55, borderRadius: 18, overflow: 'hidden' },
  solveGradient: { width: '100%', height: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  solveText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  disabledButton: { opacity: 0.6 },
  solutionSection: { marginTop: 10 },
  sectionDivider: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 25 },
  line: { flex: 1, height: 1, opacity: 0.3 },
  dividerLabel: { fontSize: 11, fontWeight: '900', letterSpacing: 2 },
  formulaBox: { flexDirection: 'row', alignItems: 'center', gap: 15, padding: 18, borderRadius: 20, borderWidth: 1, marginBottom: 20 },
  formulaHeader: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  formulaValue: { fontSize: 18, fontWeight: '700', marginTop: 2 },
  formulaContent: { flex: 1 },
  stepCard: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 22, marginBottom: 15, elevation: 2 },
  stepNumber: { width: 30, height: 30, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  stepNumberText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  stepContent: { flex: 1, marginHorizontal: 15 },
  stepText: { fontSize: 15, fontWeight: '500', lineHeight: 22 },
  pulseContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginVertical: 20 },
  pulseText: { fontSize: 13, fontWeight: 'bold' },
  hintBox: { borderRadius: 24, overflow: 'hidden', marginTop: 15 },
  blurHint: { padding: 22, backgroundColor: 'rgba(255, 179, 0, 0.1)' },
  hintHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  hintTitle: { fontSize: 12, fontWeight: '900', color: '#FFB300', letterSpacing: 1 },
  hintBody: { fontSize: 14, fontWeight: '500', lineHeight: 22 }
});