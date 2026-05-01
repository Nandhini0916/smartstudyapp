import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = {
  dark: boolean;
  colors: {
    background: string;
    card: string;
    text: string;
    subtext: string;
    primary: string;
    secondary: string;
    border: string;
    header: [string, string];
  };
};

const LightTheme: Theme = {
  dark: false,
  colors: {
    background: '#F8F9FF',
    card: '#FFFFFF',
    text: '#1A1A2E',
    subtext: '#666666',
    primary: '#4A6CF7',
    secondary: '#6B8CF7',
    border: '#E5E7EB',
    header: ['#4A6CF7', '#6B8CF7'],
  },
};

const DarkTheme: Theme = {
  dark: true,
  colors: {
    background: '#0F172A',
    card: '#1E293B',
    text: '#F8FAFC',
    subtext: '#94A3B8',
    primary: '#6366F1',
    secondary: '#818CF8',
    border: '#334155',
    header: ['#1E293B', '#0F172A'],
  },
};

type ThemeContextType = {
  theme: Theme;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('darkMode');
      if (savedTheme !== null) {
        setIsDarkMode(JSON.parse(savedTheme));
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleDarkMode = async () => {
    try {
      const newValue = !isDarkMode;
      setIsDarkMode(newValue);
      await AsyncStorage.setItem('darkMode', JSON.stringify(newValue));
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const theme = isDarkMode ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
