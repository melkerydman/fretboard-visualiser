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