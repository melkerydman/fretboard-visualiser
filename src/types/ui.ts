// UI, layout, and application state types

import { THEME_OPTIONS, LAYOUT_OPTIONS } from '../constants/ui';

// Extract the actual values from the constants for type safety
export type ThemeMode = typeof THEME_OPTIONS[number]['value'];
export type LayoutSize = typeof LAYOUT_OPTIONS[number]['value'];

// Application view modes
export type ViewMode = 'chord' | 'scale' | 'identifier';

// Fretboard orientation options
export type StringOrder = 'low-to-high' | 'high-to-low';
export type HeadstockPosition = 'left' | 'right';

// UI settings interface
export interface UISettings {
  theme: ThemeMode;
  layoutSize: LayoutSize;
  leftHanded: boolean;
  verticalFretboard: boolean;
  stringOrder: StringOrder;
  headstockPosition: HeadstockPosition;
  darkMode?: boolean; // Computed from theme
}

