import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="screens/LoginScreen" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="screens/SignupScreen" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="screens/mathsolver" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="screens/aitutor" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="screens/textanalysis" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="screens/camerascan" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
        <Stack.Screen name="screens/scanpreview" options={{ headerShown: false, presentation: 'card' }} />
      </Stack>
    </>
  );
}