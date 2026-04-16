import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';

export default function MathSolver() {

  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleSolve = () => {
    let output = "";

    const text = input.toLowerCase();

    if (text.includes("triangle") || text.includes("hypotenuse")) {
      output = "Formula: a² + b² = c²\nHint: Use Pythagoras theorem";
    } 
    else if (text.includes("derivative")) {
      output = "Formula: d/dx (x^n) = n*x^(n-1)\nHint: Apply differentiation rule";
    } 
    else if (text.includes("integration")) {
      output = "Formula: ∫x^n dx = (x^(n+1))/(n+1)\nHint: Use integration rule";
    } 
    else if (text.includes("speed") || text.includes("distance")) {
      output = "Formula: Speed = Distance / Time\nHint: Rearrange formula";
    } 
    else if (text.includes("area") && text.includes("circle")) {
      output = "Formula: πr²\nHint: Find radius first";
    } 
    else {
      output = "No matching formula found. Try rephrasing.";
    }

    setResult(output);
  };

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>Math Solver</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your math problem"
        value={input}
        onChangeText={setInput}
      />

      <TouchableOpacity style={styles.button} onPress={handleSolve}>
        <Text style={styles.buttonText}>Get Formula & Hint</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Result:</Text>

      <Text style={styles.result}>{result}</Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 10, marginBottom: 20 },
  button: { backgroundColor: '#4A6CF7', padding: 15, borderRadius: 10, marginBottom: 20 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  subtitle: { fontSize: 16, marginBottom: 10 },
  result: { fontSize: 14, color: '#333' },
});