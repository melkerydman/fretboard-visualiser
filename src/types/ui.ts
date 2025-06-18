// UI, layout, and application state types

import { THEME_OPTIONS, LAYOUT_OPTIONS } from '../constants/ui';

// Extract the actual values from the constants for type safety
export type ThemeMode = typeof THEME_OPTIONS[number]['value'];
export type LayoutSize = typeof LAYOUT_OPTIONS[number]['value'];

// Application view modes
export type ViewMode = 'chord' | 'scale' | 'identifier';

// UI settings interface
export interface UISettings {
  theme: ThemeMode;
  layoutSize: LayoutSize;
  leftHanded: boolean;
  verticalFretboard: boolean;
  darkMode?: boolean; // Computed from theme
}

// Specific theme-related types
export interface ThemeClasses {
  bg: string;
  cardBg: string;
  border: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  input: string;
  button: string;
}

export interface FretboardTheme {
  fretboard: string;
  fret: string;
  nutFret: string;
  string: string;
  fretMarker: string;
  note: string;
  noteStroke: string;
  greyedNote: string;
  greyedStroke: string;
  capo: string;
  text: string;
}