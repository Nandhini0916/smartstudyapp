import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

type SettingsContextType = {
  autoSaveEnabled: boolean;
  pushNotifications: boolean;
  emailAlerts: boolean;
  featureAnnouncements: boolean;
  setAutoSaveEnabled: (value: boolean) => Promise<void>;
  setPushNotifications: (value: boolean) => Promise<void>;
  setEmailAlerts: (value: boolean) => Promise<void>;
  setFeatureAnnouncements: (value: boolean) => Promise<void>;
  playFeedback: (type?: Haptics.ImpactFeedbackStyle) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [autoSaveEnabled, _setAutoSaveEnabled] = useState(true);
  
  // Notification States
  const [pushNotifications, _setPushNotifications] = useState(true);
  const [emailAlerts, _setEmailAlerts] = useState(false);
  const [featureAnnouncements, _setFeatureAnnouncements] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.multiGet([
        'autoSaveEnabled',
        'pushNotifications',
        'emailAlerts',
        'featureAnnouncements'
      ]);

      settings.forEach(([key, value]) => {
        if (value !== null) {
          const parsedValue = JSON.parse(value);
          switch (key) {
            case 'autoSaveEnabled': _setAutoSaveEnabled(parsedValue); break;
            case 'pushNotifications': _setPushNotifications(parsedValue); break;
            case 'emailAlerts': _setEmailAlerts(parsedValue); break;
            case 'featureAnnouncements': _setFeatureAnnouncements(parsedValue); break;
          }
        }
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSetting = async (key: string, value: any, setter: (v: any) => void) => {
    setter(value);
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  };

  const setAutoSaveEnabled = (value: boolean) => saveSetting('autoSaveEnabled', value, _setAutoSaveEnabled);
  const setPushNotifications = (value: boolean) => saveSetting('pushNotifications', value, _setPushNotifications);
  const setEmailAlerts = (value: boolean) => saveSetting('emailAlerts', value, _setEmailAlerts);
  const setFeatureAnnouncements = (value: boolean) => saveSetting('featureAnnouncements', value, _setFeatureAnnouncements);

  const playFeedback = (type: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
    // Sound effects have been removed as per user request
  };

  return (
    <SettingsContext.Provider 
      value={{ 
        autoSaveEnabled, 
        pushNotifications,
        emailAlerts,
        featureAnnouncements,
        setAutoSaveEnabled,
        setPushNotifications,
        setEmailAlerts,
        setFeatureAnnouncements,
        playFeedback 
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
