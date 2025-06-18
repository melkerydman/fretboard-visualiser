# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint code linting
- `npm run typecheck` - Run TypeScript type checking
- `npm run preview` - Preview production build locally

## Architecture Overview

This is a single-page React application for guitar chord and scale visualization built with modern web technologies. The project is currently undergoing **TypeScript conversion** and has been **refactored from a single-file architecture** into a well-organized modular structure.

### Current Architecture Status

**Main Application Flow:**
- `src/main.jsx` → `src/App.jsx` → `src/containers/FretboardVisualizerApp.jsx` (669 lines)
- **Modular architecture** with clear separation of concerns (no longer single-file!)
- Context providers for comprehensive state management
- **Mixed TypeScript/JavaScript codebase** (TypeScript conversion in progress)

### Directory Structure

```
src/
├── components/          # UI Components (JSX)
│   ├── guitar/         # Guitar-specific components
│   │   ├── Fretboard.jsx (interactive SVG fretboard)
│   │   └── index.js
│   └── ui/            # Reusable UI components
│       ├── icons/     # Icon components
│       └── modals/    # Modal components
├── constants/          # TypeScript Constants
│   ├── guitar.ts      # Guitar-related constants
│   ├── music.ts       # Music theory constants
│   ├── ui.ts          # UI/theme constants
│   └── index.ts       # Barrel exports
├── containers/         # Container Components (JSX)
│   └── FretboardVisualizerApp.jsx (main app logic)
├── context/           # React Context (TypeScript)
│   ├── GuitarContext.tsx
│   ├── MusicalContext.tsx
│   └── index.js
├── hooks/             # Custom Hooks (TypeScript)
│   ├── guitar/        # Guitar-related hooks
│   ├── music/         # Music theory hooks
│   └── ui/            # UI/theme hooks
├── services/          # Business Logic (TypeScript)
│   └── musicTheory.ts # Core music theory engine
└── types/             # TypeScript Definitions
    ├── guitar.ts      # Guitar-related types
    ├── music.ts       # Music theory types
    ├── ui.ts          # UI-related types
    └── index.ts       # Type exports
```

### TypeScript Migration Status

**Converted to TypeScript (16 files):**
- All services, types, constants, contexts, and hooks
- Comprehensive type system with strict configuration
- Type-safe music theory calculations and guitar logic

**Remaining JavaScript (8 files):**
- Components still in JSX but consuming TypeScript types
- Main containers and UI components

### Technology Stack

- **React 19.1.0** with modern hooks patterns
- **TypeScript 5.8.3** with strict configuration
- **Vite 6.3.5** for build tooling and development server
- **Tailwind CSS 4.1.10** with the new `@tailwindcss/vite` plugin
- **ESLint 9.25.0** with flat config and React-specific rules
- **Node.js 22+** (specified in engines and .nvmrc)

### Key Architecture Components

**1. Context-Based State Management:**
- `GuitarContext`: Guitar state, fretboard logic, capo management
- `MusicalContext`: Note naming, key signatures, music theory
- No external state management library needed

**2. MusicTheory Service (TypeScript):**
- Fully converted to TypeScript with comprehensive types
- Semitone-based note system (0-11 representing chromatic notes)
- Chord and scale generation using interval formulas
- Guitar tuning definitions and custom tuning support
- Note position finding on fretboard with capo support

**3. Interactive SVG Fretboard:**
- Pure SVG with mathematical positioning calculations
- Supports horizontal and vertical orientations
- Drag-and-drop capo with visual feedback
- Real-time note highlighting and interaction
- Responsive sizing based on layout preferences

**4. Theme and Settings System:**
- Dark/light/system theme detection via useTheme hook
- Multiple layout sizes (compact/comfortable/spacious)
- Persistent user preferences
- Dynamic theme switching with context-aware styling

### Code Organization Patterns

**Component Structure:**
- Functional components with hooks throughout
- Extensive use of `useMemo` for performance optimization
- TypeScript types imported and used in JSX components
- SVG rendering with mathematical calculations for positioning

**State Management:**
- Context providers for shared state
- Custom hooks for domain-specific logic
- Derived state with `useMemo` for complex calculations
- Type-safe state updates and calculations

**Styling Approach:**
- Tailwind utility classes with conditional rendering
- Dynamic theme switching via computed class objects
- Responsive design with breakpoint-specific layouts
- Tailwind v4 with new Vite plugin (no separate config)

## Important Implementation Details

**Performance Considerations:**
- Heavy use of `useMemo` for expensive calculations
- SVG rendering optimized for interactive performance
- Theme calculations cached to prevent excessive re-renders
- Context providers minimize unnecessary re-renders

**Type Safety:**
- Strict TypeScript configuration with comprehensive types
- Type-safe music theory calculations
- Strongly typed guitar and UI state management
- Runtime type validation for critical calculations

**Fretboard Rendering:**
- Pure SVG with mathematical positioning calculations
- Coordinate system switches between horizontal/vertical orientations
- Capo logic includes string coverage and note greying
- Real-time drag interaction with mouse event handling

## Configuration Notes

**TypeScript Configuration:**
- Strict mode enabled with comprehensive type checking
- ES2020 target with modern module resolution
- Path mapping and barrel exports for clean imports

**ESLint Configuration:**
- Modern flat config format
- Allows unused variables with uppercase/underscore patterns
- React hooks rules enforced
- TypeScript-aware linting rules

**Build Configuration:**
- Standard Vite React + TypeScript setup
- Tailwind v4 with `@tailwindcss/vite` plugin
- No custom build optimizations or aliases configured

## Current Development Status

**Active Refactoring in Progress:**
- ✅ Consolidated GuitarVisualizerApp code directly into App.jsx (eliminated container layer)
- ✅ Removed containers directory
- Currently extracting large components into separate files for better maintainability
- Converting remaining JavaScript components to TypeScript
- Creating shared type interfaces for component props and state

**Next Steps:**
1. ✅ Consolidate App.jsx with GuitarVisualizerApp content
2. ✅ Extract components to separate files (ModeSelector, MainControls, CustomTuningSelector)
3. 🔄 Continue extracting remaining large components (ChordIdentifier, StatusPanel, CapoControls)
4. Complete TypeScript conversion of extracted components
5. Create comprehensive shared types file

## Claude Code Instructions

**Memory Management:**
- **ALWAYS update this CLAUDE.md file before OR after completing any significant task**
- **Update project memory immediately if interrupted or if session crashes**
- Keep development status section current with ongoing work
- Document any architectural decisions or patterns discovered

**Git Commit Guidelines:**
- **NEVER add Claude as co-author when committing code**
- Use standard commit messages without Claude attribution
- Create logical checkpoint commits during refactoring work

**Development Approach:**
- Prefer editing existing files over creating new ones
- Follow established TypeScript patterns and type definitions
- **Avoid type casting (`as` keyword) as much as possible** - prefer proper type guards, narrowing, and strict typing
- Maintain existing performance optimizations (useMemo patterns)
- Run `npm run typecheck` after TypeScript changes
- Run `npm run lint` before committing changes

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.