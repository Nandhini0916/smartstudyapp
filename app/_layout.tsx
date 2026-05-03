import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

function AppLayout() {
  const { isDarkMode } = useTheme();
  
  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'light'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="screens/LoginScreen" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="screens/SignupScreen" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="screens/mathsolver" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="screens/textanalysis" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="screens/scanpreview" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="screens/editprofile" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="screens/settings" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="screens/notifications" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="screens/support" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="screens/about" options={{ headerShown: false, presentation: 'card' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppLayout />
    </ThemeProvider>
  );
}