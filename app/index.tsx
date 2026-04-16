import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {

  const router = useRouter();

  return (
    <View style={styles.container}>

      <View style={styles.topSection}>
        <Text style={styles.heading}>Welcome to Smart Study Assistant</Text>
        <Text style={styles.subheading}>
          Enhance your learning and problem solving skills
        </Text>

        <Image
          source={require('../assets/images/studyapp.jpg')}
          style={styles.image}
        />
      </View>

      <View style={styles.bottomSection}>

        <View style={styles.row}>

          {/* TEXT ANALYSIS */}
          <View style={styles.column}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Text Analysis</Text>
              <Text style={styles.cardText}>
                Get meanings of difficult words
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.button}
              onPress={() => router.push('/screens/textanalysis')}   // ✅ FIXED
            >
              <Text style={styles.buttonText}>Upload Document</Text>
            </TouchableOpacity>
          </View>

          {/* MATH SOLVER */}
          <View style={styles.column}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Math Solver</Text>
              <Text style={styles.cardText}>
                Get formulas & hints
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.button}
              onPress={() => router.push('/screens/mathsolver')}   // ✅ FIXED
            >
              <Text style={styles.buttonText}>Upload Math Problem</Text>
            </TouchableOpacity>
          </View>

        </View>

        <Text style={styles.footer}>
          Smart AI tutor for better learning
        </Text>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#6F8EDB' },
  topSection: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  heading: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  subheading: { color: '#fff', textAlign: 'center', marginVertical: 10 },
  image: { width: 180, height: 180, marginTop: 15, borderRadius: 15 },
  bottomSection: { flex: 1, padding: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  column: { width: '48%', alignItems: 'center' },
  card: { backgroundColor: '#fff', width: '100%', padding: 15, borderRadius: 12 },
  cardTitle: { color: '#4A6CF7', fontWeight: 'bold', fontSize: 14 },
  cardText: { fontSize: 12, marginTop: 5, color: '#333' },
  button: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginTop: 10, width: '100%', alignItems: 'center' },
  buttonText: { color: '#4A6CF7', fontWeight: 'bold', fontSize: 13 },
  footer: { color: '#fff', textAlign: 'center', marginTop: 20, fontSize: 12 },
});