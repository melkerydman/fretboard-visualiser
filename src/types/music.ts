// Core music theory types

import { NOTE_NAMES, CHORD_TYPES, SCALE_TYPES } from '../constants/music';

export type Semitone = number; // 0-11, but allowing math operations
export type NoteLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export type NoteName = typeof NOTE_NAMES[number];
export type ChordType = typeof CHORD_TYPES[number];
export type ScaleType = typeof SCALE_TYPES[number];

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