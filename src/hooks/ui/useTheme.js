import { useState, useEffect } from "react";

/**
 * Custom hook for managing theme state and system dark mode detection
 * Handles system preference detection, theme state management, and computed theme values
 */
export const useTheme = (initialTheme = "system") => {
  // System dark mode detection state
  const [systemDarkMode, setSystemDarkMode] = useState(
    typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  // Theme state (system/light/dark)
  const [theme, setTheme] = useState(initialTheme);
  
  // Computed dark mode boolean based on theme setting and system preference
  const [darkMode, setDarkMode] = useState(false);

  // System dark mode detection effect
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e) => setSystemDarkMode(e.matches);

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      }
    }
  }, []);

  // Theme computation effect
  useEffect(() => {
    let newDarkMode = false;

    switch (theme) {
      case "dark":
        newDarkMode = true;
        break;
      case "light":
        newDarkMode = false;
        break;
      case "system":
      default:
        newDarkMode = systemDarkMode;
        break;
    }

    setDarkMode(newDarkMode);
  }, [theme, systemDarkMode]);

  // Computed theme classes for consistent styling
  const themeClasses = {
    bg: darkMode ? "bg-gray-900" : "bg-gray-50",
    cardBg: darkMode ? "bg-gray-800" : "bg-white",
    border: darkMode ? "border-gray-700" : "border-gray-300",
    text: darkMode ? "text-white" : "text-gray-900",
    textSecondary: darkMode ? "text-gray-300" : "text-gray-600",
    textTertiary: darkMode ? "text-gray-400" : "text-gray-700",
    input: darkMode
      ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500",
    button: darkMode
      ? "bg-blue-600 hover:bg-blue-700 text-white"
      : "bg-blue-600 hover:bg-blue-700 text-white",
  };

  // Fretboard-specific theme values
  const fretboardTheme = {
    fretboard: darkMode ? "#2D1B1B" : "#F7E6A3",
    fret: darkMode ? "#555" : "#ccc",
    nutFret: darkMode ? "#777" : "#333",
    string: darkMode ? "#888" : "#666",
    fretMarker: darkMode ? "#666" : "#ddd",
    note: darkMode ? "#3B82F6" : "#3B82F6",
    noteStroke: darkMode ? "#1E40AF" : "#1E40AF",
    greyedNote: darkMode ? "#6B7280" : "#9CA3AF",
    greyedStroke: darkMode ? "#4B5563" : "#6B7280",
    capo: darkMode ? "#8B4513" : "#8B4513",
    text: darkMode ? "#E5E7EB" : "#374151",
  };

  return {
    // Current state
    theme,
    darkMode,
    systemDarkMode,
    
    // Setters
    setTheme,
    
    // Computed values
    themeClasses,
    fretboardTheme,
  };
};

export default useTheme;