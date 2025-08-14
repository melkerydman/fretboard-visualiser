import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { UISettings } from '../types/ui';

interface SettingsContextType {
  settings: UISettings;
  setSettings: React.Dispatch<React.SetStateAction<UISettings>>;
  updateSettings: (newSettings: Partial<UISettings>) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [settings, setSettings] = useState<UISettings>({
    theme: "system",
    verticalFretboard: false,
    layoutSize: "comfortable",
    leftHanded: false,
    stringOrder: "low-to-high",
    headstockPosition: "left",
    darkMode: false,
  });

  const updateSettings = useCallback((newSettings: Partial<UISettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSettings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};