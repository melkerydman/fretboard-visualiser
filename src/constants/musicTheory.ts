// Music theory constants for better IntelliSense and type safety

export const NOTE_NAMES = [
  "C", "C#", "Db", "D", "D#", "Eb", "E", "F", 
  "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B",
  "B#", "Cb", "E#", "Fb" // Include enharmonic equivalents
] as const;

export const CHORD_TYPES = [
  "major", "minor", "dim", "aug", "sus2", "sus4", 
  "maj7", "min7", "dom7", "dim7", "maj9", "min9", "add9"
] as const;

export const SCALE_TYPES = [
  "major", "minor", "dorian", "phrygian", "lydian", 
  "mixolydian", "locrian", "pentatonic", "blues", 
  "harmonic_minor", "melodic_minor"
] as const;