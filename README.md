# Fretboard Visualiser

An interactive web application for guitar chord and scale visualisation, created as an experiment in AI-assisted development using Claude. The idea came from playing guitar in a variety of different tunings - with a rather basic understanding of what I do, I wanted a tool that could help me navigate the fretboard in any tuning.

## Features

**Chord explorer mode**

- Input chord names to see their shapes on the fretboard
- Multiple fingering options for the same chord

**Scale explorer mode**

- Visualise scale patterns across the entire fretboard
- Major, minor, pentatonic, and other common scales
- See related chords that work with each scale

**Chord identifier mode**

- Click notes on the fretboard to build chords
- Get chord suggestions with confidence ratings
- Discover what chord you're actually playing

**General features**

- Drag-and-drop capo positioning with visual feedback
- Custom tuning support that adapts everything
- Horizontal/vertical fretboard orientations
- Smart note naming based on key signatures
- Dark/light themes with multiple sizing options

## Main tech and tools

- React + TypeScript
- Vite
- Tailwind CSS
- SVG for interactive fretboard rendering
- Claude AI

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run type checking and linting
npm run typecheck
npm run lint
```

## Process

I prompted like a mad man, and allowed Claude to vibe like an equal mad man. The enthusiastic feature-adding phase ultimately turned into one grand, yet functional, mess - it worked, but it was pretty much crammed into a single massive file.

Had to be followed by working out an actual structure for the project. Started the long journey of refactoring to TypeScript, breaking out components, and moving complex state to contexts. Went from a monster to a modular system with proper separation of concerns.

With some boundaries and methods set, cracking on with new features and improvements became a more straight-forward operation.

## Architecture decisions

The refactoring ended up with some structural patterns that worked well:

- **Context-based state management** created separate contexts for guitar state, musical context, settings, and theming
- **Service layer for music theory** - kept all the chord/scale calculations and fretboard logic separate from UI components
- **Component extraction** - broke the behemoth into more focused, reusable pieces
- **TypeScript migration** - added strict typing gradually without breaking existing functionality
- **SVG-based fretboard** - mathematical positioning that adapts to different orientations and layouts

## Learnings

Some key takeaways from this experiment in AI-assisted chaos and recovery:

- Claude is great for getting ideas into working code fast. The speed of going from concept to functional feature is unmatched for rapid prototyping.

- Great for exploration and proof-of-concepts, but you need human oversight to manage code quality and architecture. Claude will happily build you into a corner if you let it.

- The mess you create in the rapid prototyping phase will need to be cleaned up later. The unnecessary work of not giving Claude some boundaries and initial structure became obvious. Plan for it, or you'll be climbing that refactoring mountain whether you want to or not.

- Works best when you guide it with clear constraints and architectural decisions, rather than just letting it run wild with feature requests.

The project showed both the incredible potential and the pitfalls of AI-assisted development - powerful for getting started, but human judgement remains essential for creating maintainable software.

_P.S. This README was also co-written with Claude, why break the pattern now?_
