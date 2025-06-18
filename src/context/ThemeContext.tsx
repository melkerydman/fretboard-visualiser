import React, { createContext, useContext, ReactNode } from 'react';
import { useTheme } from '../hooks/ui/useTheme';
import { useSettings } from './SettingsContext';
import { ThemeClasses, ThemeMode } from '../types/ui';

interface ThemeContextType {
  themeClasses: ThemeClasses;
  darkMode: boolean;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { settings, updateSettings } = useSettings();
  const { themeClasses, darkMode, theme, setTheme } = useTheme(settings.theme);

  // Update settings when theme changes
  React.useEffect(() => {
    updateSettings({ darkMode, theme });
  }, [darkMode, theme, updateSettings]);

  // Sync theme changes from settings to hook
  React.useEffect(() => {
    if (settings.theme !== theme) {
      setTheme(settings.theme);
    }
  }, [settings.theme, theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ themeClasses, darkMode, theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};