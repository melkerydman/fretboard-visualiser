// Guitar-specific types

import { Semitone, NoteName } from './music';

export type StringIndex = number; // 0-5 for standard guitar
export type FretNumber = number; // 0-24+ 
export type Tuning = Semitone[]; // Array of 6 semitones for standard guitar

export interface Capo {
  fret: FretNumber;
  strings: number; // How many strings to cover (1-6)
  fromTop: boolean; // Whether to cover from thin strings (true) or thick strings (false)
}

export interface NotePosition {
  string: StringIndex;
  fret: FretNumber;
  note: Semitone;
  noteName: NoteName;
}

export interface RecommendedCapoPosition {
  fret: FretNumber;
  matchingStrings: number;
  score: number;
}

export interface TuningDefinitions {
  [key: string]: Tuning;
}