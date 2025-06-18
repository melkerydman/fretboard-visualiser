// Core music theory types

export type Semitone = number; // 0-11, but allowing math operations
export type NoteLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
export type NoteName = 
  | "C" | "C#" | "Db" | "D" | "D#" | "Eb" | "E" | "F" 
  | "F#" | "Gb" | "G" | "G#" | "Ab" | "A" | "A#" | "Bb" | "B"
  | "B#" | "Cb" | "E#" | "Fb"; // Include enharmonic equivalents

export type ChordType = 
  | "major" | "minor" | "dim" | "aug" | "sus2" | "sus4" 
  | "maj7" | "min7" | "dom7" | "dim7" | "maj9" | "min9" | "add9";

export type ScaleType = 
  | "major" | "minor" | "dorian" | "phrygian" | "lydian" 
  | "mixolydian" | "locrian" | "pentatonic" | "blues" 
  | "harmonic_minor" | "melodic_minor";

export interface MusicalContext {
  key?: NoteName;
  scale?: ScaleType;
  chord?: ChordType;
  mode?: string;
}

export interface Note {
  semitone: Semitone;
  name: NoteName;
  letter?: string;
  interval?: number;
}

export interface Chord {
  root: Semitone;
  rootName: NoteName;
  type: ChordType;
  name: string;
  notes: Semitone[];
  matchingNotes?: Semitone[];
  confidence?: number;
  isPartial?: boolean;
  hasExtraNotes?: boolean;
  isInversion?: boolean;
}

export interface Scale {
  root: Semitone;
  rootName: NoteName;
  type: ScaleType;
  name: string;
  notes: Semitone[];
  intervals: number[];
}

export interface ScaleNote extends Note {
  degree: number;
}

export interface ChordFormula {
  [key: string]: number[];
}

export interface ScaleFormula {
  [key: string]: number[];
}

export interface ScaleWithNames {
  root: Semitone;
  rootName: NoteName;
  type: ScaleType;
  notes: ScaleNote[];
}