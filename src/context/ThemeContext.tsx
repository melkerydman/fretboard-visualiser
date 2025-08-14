import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useSettings } from './SettingsContext';
import { ThemeMode } from '../types/ui';

interface ThemeContextType {
  theme: ThemeMode;
  darkMode: boolean;
  systemDarkMode: boolean;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { settings, updateSettings } = useSettings();
  
  // System dark mode detection state
  const [systemDarkMode, setSystemDarkMode] = useState(
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  // Theme state
  const [theme, setTheme] = useState<ThemeMode>(settings.theme);

  // Effect to listen for system dark mode changes
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemDarkMode(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Computed dark mode based on theme setting
  const darkMode = theme === "dark" || (theme === "system" && systemDarkMode);

  // Set data-theme attribute on document root for CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Update settings when theme changes
  useEffect(() => {
    updateSettings({ darkMode, theme });
  }, [darkMode, theme, updateSettings]);

  // Sync theme changes from settings to local state
  useEffect(() => {
    if (settings.theme !== theme) {
      setTheme(settings.theme);
    }
  }, [settings.theme, theme]);

  return (
    <ThemeContext.Provider value={{ theme, darkMode, systemDarkMode, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};