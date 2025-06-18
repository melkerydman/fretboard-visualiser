import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useSettings } from './SettingsContext';
import { ThemeClasses, ThemeMode, FretboardTheme } from '../types/ui';

interface ThemeContextType {
  theme: ThemeMode;
  darkMode: boolean;
  systemDarkMode: boolean;
  setTheme: (theme: ThemeMode) => void;
  themeClasses: ThemeClasses;
  fretboardTheme: FretboardTheme;
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

  // Theme classes for styling
  const themeClasses: ThemeClasses = {
    bg: darkMode ? "bg-gray-900" : "bg-gray-50",
    cardBg: darkMode ? "bg-gray-800" : "bg-white",
    text: darkMode ? "text-gray-100" : "text-gray-900",
    textSecondary: darkMode ? "text-gray-300" : "text-gray-600",
    textTertiary: darkMode ? "text-gray-400" : "text-gray-500",
    border: darkMode ? "border-gray-700" : "border-gray-200",
    button: darkMode
      ? "bg-gray-700 hover:bg-gray-600 text-gray-100"
      : "bg-gray-100 hover:bg-gray-200 text-gray-900",
    input: darkMode
      ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
      : "bg-white border-gray-300 text-gray-900 focus:border-blue-500",
  };

  // Fretboard-specific theme
  const fretboardTheme: FretboardTheme = {
    fretboard: darkMode ? "#374151" : "#D1D5DB",
    fret: darkMode ? "#6B7280" : "#9CA3AF",
    nutFret: darkMode ? "#4B5563" : "#9CA3AF",
    string: darkMode ? "#9CA3AF" : "#6B7280",
    fretMarker: darkMode ? "#6B7280" : "#9CA3AF",
    note: darkMode ? "#3B82F6" : "#2563EB",
    noteStroke: "#FFFFFF",
    greyedNote: darkMode ? "#6B7280" : "#9CA3AF",
    greyedStroke: darkMode ? "#9CA3AF" : "#6B7280",
    capo: "#F59E0B",
    text: "#FFFFFF",
  };

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
    <ThemeContext.Provider value={{ theme, darkMode, systemDarkMode, setTheme, themeClasses, fretboardTheme }}>
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