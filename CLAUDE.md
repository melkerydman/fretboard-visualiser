# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint code linting
- `npm run preview` - Preview production build locally

## Architecture Overview

This is a single-page React application for guitar chord and scale visualization built with modern web technologies.

### Core Architecture

**Main Application Flow:**
- `src/main.jsx` → `src/App.jsx` → `GuitarVisualizerApp` component
- Single-file architecture with all components in `App.jsx` (1600+ lines)
- Uses React 19 with hooks for state management (no external state library)

**Key Modules:**
1. **MusicTheory Module** - Pure JavaScript music theory engine:
   - Note/semitone conversions and calculations
   - Chord formulas (major, minor, 7ths, 9ths, etc.)
   - Scale formulas (major, minor, modes, pentatonic, blues)
   - Guitar tuning definitions and custom tuning support
   - Note position finding on fretboard with capo support

2. **GuitarFretboard Component** - Interactive SVG fretboard renderer:
   - Supports both horizontal and vertical orientations
   - Drag-and-drop capo with visual feedback
   - Real-time note highlighting and interaction
   - Responsive sizing based on layout preferences

3. **Settings System** - Theme and layout management:
   - Dark/light/system theme detection
   - Multiple layout sizes (compact/comfortable/spacious)
   - Persistent user preferences

### Technology Stack

- **React 19.1.0** with modern hooks patterns
- **Vite 6.3.5** for build tooling and development server
- **Tailwind CSS 4.1.10** with the new Vite plugin (v4 syntax)
- **ESLint 9.25.0** with flat config and React-specific rules
- **Node.js 22+** (specified in engines and .nvmrc)

### Code Organization Patterns

**Component Structure:**
- Functional components with hooks throughout
- Extensive use of `useMemo` for performance optimization
- Custom theme classes computed dynamically based on dark mode
- SVG rendering with mathematical calculations for fret/string positioning

**State Management:**
- Local component state with `useState`
- Derived state with `useMemo` for complex calculations
- No external state management library

**Styling Approach:**
- Tailwind utility classes with conditional rendering
- Dynamic theme switching via computed class objects
- Responsive design with breakpoint-specific layouts

## Important Implementation Details

**Music Theory Engine:**
- All music calculations happen in the `MusicTheory` object
- Semitone-based note system (0-11 representing chromatic notes)
- Chord and scale generation uses interval formulas
- Guitar tuning represented as arrays of semitone values

**Fretboard Rendering:**
- Pure SVG with mathematical positioning calculations
- Coordinate system switches between horizontal/vertical orientations
- Capo logic includes string coverage and note greying
- Real-time drag interaction with mouse event handling

**Performance Considerations:**
- Heavy use of `useMemo` for expensive calculations
- SVG rendering optimized for interactive performance
- Theme calculations cached to prevent excessive re-renders

## Configuration Notes

**ESLint Configuration:**
- Uses modern flat config format
- Allows unused variables with uppercase/underscore patterns
- React hooks rules enforced
- React refresh rules for development

**Tailwind CSS:**
- Uses Tailwind v4 with `@tailwindcss/vite` plugin
- No separate Tailwind config file (uses defaults)
- Dark mode via class-based switching

**Build Configuration:**
- Standard Vite React setup
- No custom build optimizations or aliases configured