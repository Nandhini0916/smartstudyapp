import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface WordItem {
  _id: string;
  word: string;
  definition: string;
  partOfSpeech: string;
  mastered: boolean;
  addedDate: string;
}

export default function VocabularyScreen() {
  const { theme, isDarkMode } = useTheme();
  const [words, setWords] = useState<WordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVocabulary = async () => {
    try {
      const response = await api.get('/vocabulary');
      setWords(response.data);
    } catch (error) {
      console.error('Fetch Vocabulary Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Re-fetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchVocabulary();
    }, [])
  );

  const toggleMastered = async (id: string, currentlyMastered: boolean) => {
    try {
      // Optimistic update
      setWords(prev => prev.map(w => w._id === id ? { ...w, mastered: !currentlyMastered } : w));
      await api.put(`/vocabulary/${id}/review`, { mastered: !currentlyMastered });
    } catch (error) {
      console.error('Toggle Mastered Error:', error);
      // Revert if failed
      fetchVocabulary();
    }
  };

  const renderItem = ({ item }: { item: WordItem }) => (
    <View style={[styles.wordCard, { backgroundColor: theme.colors.card }]}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={[styles.wordText, { color: theme.colors.text }]}>
            {item.word.charAt(0).toUpperCase() + item.word.slice(1)}
          </Text>
          <View style={[styles.posBadge, { backgroundColor: theme.colors.primary + '15' }]}>
            <Text style={[styles.posText, { color: theme.colors.primary }]}>{item.partOfSpeech}</Text>
          </View>
        </View>
        <TouchableOpacity 
          onPress={() => toggleMastered(item._id, item.mastered)}
          style={[
            styles.masteredButton, 
            { backgroundColor: item.mastered ? '#10B98120' : theme.colors.border + '50' }
          ]}
        >
          <Ionicons 
            name={item.mastered ? "checkmark-circle" : "ellipse-outline"} 
            size={24} 
            color={item.mastered ? "#10B981" : theme.colors.subtext} 
          />
          <Text style={[
            styles.masteredText, 
            { color: item.mastered ? "#10B981" : theme.colors.subtext }
          ]}>
            {item.mastered ? 'Mastered' : 'Learning'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.definitionText, { color: theme.colors.subtext }]}>
        {item.definition}
      </Text>
      
      <View style={styles.cardFooter}>
        <Text style={[styles.dateText, { color: theme.colors.subtext + '80' }]}>
          Added {new Date(item.addedDate).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient colors={theme.colors.header} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>My Vocabulary</Text>
            <Text style={styles.headerSubTitle}>{words.length} words collected</Text>
          </View>
          <View style={styles.headerIcon}>
            <MaterialCommunityIcons name="book-open-variant" size={32} color="#fff" />
          </View>
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : words.length === 0 ? (
        <View style={styles.centerContainer}>
          <View style={[styles.emptyIconContainer, { backgroundColor: theme.colors.card }]}>
            <Ionicons name="book-outline" size={64} color={theme.colors.primary + '40'} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>Your dictionary is empty</Text>
          <Text style={[styles.emptySubTitle, { color: theme.colors.subtext }]}>
            Analyze documents or scan math problems to find and save difficult words.
          </Text>
        </View>
      ) : (
        <FlatList
          data={words}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchVocabulary();
              }}
              tintColor={theme.colors.primary}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60, paddingBottom: 25, paddingHorizontal: 25,
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
  },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  headerSubTitle: { fontSize: 14, color: '#fff', opacity: 0.8, marginTop: 4 },
  headerIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  listContent: { padding: 20 },
  wordCard: {
    borderRadius: 20, padding: 20, marginBottom: 16,
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  wordText: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  posBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  posText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  masteredButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  masteredText: { fontSize: 12, fontWeight: 'bold', marginLeft: 6 },
  definitionText: { fontSize: 15, lineHeight: 22, marginBottom: 15 },
  cardFooter: { borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', paddingTop: 12 },
  dateText: { fontSize: 12 },
  emptyIconContainer: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  emptySubTitle: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
});
