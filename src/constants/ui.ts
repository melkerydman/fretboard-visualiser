// UI, layout, and display settings constants

// Layout configuration options for the application
export const LAYOUT_OPTIONS = [
  {
    value: "compact",
    label: "Compact",
    description: "Dense layout, good for mobile",
  },
  {
    value: "comfortable",
    label: "Comfortable", 
    description: "Balanced spacing",
  },
  {
    value: "spacious",
    label: "Spacious",
    description: "Side-by-side layout for desktop",
  },
] as const;

// Theme configuration options for the application
export const THEME_OPTIONS = [
  {
    value: "system",
    label: "System",
    description: "Follow system preference",
  },
  { 
    value: "light", 
    label: "Light", 
    description: "Light theme" 
  },
  { 
    value: "dark", 
    label: "Dark", 
    description: "Dark theme" 
  },
] as const;

// Guitar display handedness options (UI layout preference)
export const HANDEDNESS_OPTIONS = [
  {
    value: false,
    label: "Right-handed",
    description: "Standard string order"
  },
  {
    value: true,
    label: "Left-handed", 
    description: "Reversed string order"
  }
] as const;

// String order options for fretboard display
export const STRING_ORDER_OPTIONS = [
  {
    value: "low-to-high",
    label: "Low E to High E",
    description: "Low E (6th string) on top/left"
  },
  {
    value: "high-to-low",
    label: "High E to Low E", 
    description: "High E (1st string) on top/left"
  }
] as const;

// Headstock position options for horizontal fretboard
export const HEADSTOCK_POSITION_OPTIONS = [
  {
    value: "left",
    label: "Left",
    description: "Headstock on the left side"
  },
  {
    value: "right",
    label: "Right",
    description: "Headstock on the right side"
  }
] as const;