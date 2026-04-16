import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';

export default function TextAnalysis() {

  const [results, setResults] = useState([]);

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "text/plain",
    });

    if (result.assets && result.assets.length > 0) {
      const fileUri = result.assets[0].uri;

      const response = await fetch(fileUri);
      const text = await response.text();  // ✅ REAL TEXT

      processText(text);
    }
  };

  const processText = async (text) => {
    const words = text.split(/\W+/);

    // pick "difficult words" based on length
    const filtered = [...new Set(words.filter(word => word.length > 6))];

    fetchMeanings(filtered.slice(0, 5)); // limit to 5 words
  };

  const fetchMeanings = async (words) => {
    let output = [];

    for (let word of words) {
      try {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await res.json();

        const meaning = data[0]?.meanings[0]?.definitions[0]?.definition;

        output.push({ word, meaning: meaning || "No meaning found" });

      } catch (error) {
        output.push({ word, meaning: "Error fetching meaning" });
      }
    }

    setResults(output);
  };

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>Text Analysis</Text>

      <TouchableOpacity style={styles.button} onPress={pickDocument}>
        <Text style={styles.buttonText}>Upload Document</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Results:</Text>

      {results.length === 0 ? (
        <Text>No results yet</Text>
      ) : (
        results.map((item, index) => (
          <View key={index} style={styles.resultBox}>
            <Text style={styles.word}>{item.word}</Text>
            <Text style={styles.meaning}>{item.meaning}</Text>
          </View>
        ))
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  button: { backgroundColor: '#4A6CF7', padding: 15, borderRadius: 10, marginBottom: 20 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  subtitle: { fontSize: 16, marginBottom: 10 },
  resultBox: { backgroundColor: '#f2f2f2', padding: 12, borderRadius: 10, marginBottom: 10 },
  word: { fontWeight: 'bold', fontSize: 14 },
  meaning: { fontSize: 13, marginTop: 5 },
});