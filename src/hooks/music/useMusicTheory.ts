import { useMemo } from 'react';
import MusicTheory from '../../services/musicTheory';
import type { NoteName, ChordType, ScaleType, Semitone } from '../../types';

interface ScaleChord {
  root: NoteName;
  rootSemitone: Semitone;
  degree: number;
  notes: Semitone[];
}

interface UseMusicTheoryReturn {
  chordTypes: ChordType[];
  scaleTypes: ScaleType[];
  availableNotes: readonly NoteName[];
  generateChordNotes: (root: NoteName | Semitone, chordType: ChordType) => Semitone[];
  generateScaleNotes: (root: NoteName | Semitone, scaleType: ScaleType) => Semitone[];
  generateScaleChords: (root: NoteName | Semitone, scaleType: ScaleType) => ScaleChord[];
  semitoneToNote: (semitone: Semitone) => NoteName;
  noteToSemitone: (noteName: NoteName) => Semitone;
}

export const useMusicTheory = (): UseMusicTheoryReturn => {
  // Get available chord types
  const chordTypes = useMemo(() => {
    return Object.keys(MusicTheory.CHORD_FORMULAS) as ChordType[];
  }, []);

  // Get available scale types
  const scaleTypes = useMemo(() => {
    return Object.keys(MusicTheory.SCALE_FORMULAS) as ScaleType[];
  }, []);

  // Get available notes
  const availableNotes = useMemo(() => {
    return MusicTheory.NOTES;
  }, []);

  // Generate chord notes
  const generateChordNotes = (root: NoteName | Semitone, chordType: ChordType) => {
    return MusicTheory.generateChord(root, chordType);
  };

  // Generate scale notes
  const generateScaleNotes = (root: NoteName | Semitone, scaleType: ScaleType) => {
    return MusicTheory.generateScale(root, scaleType);
  };

  // Generate scale chords (chords within a scale)
  const generateScaleChords = (root: NoteName | Semitone, scaleType: ScaleType): ScaleChord[] => {
    const scaleNotes = MusicTheory.generateScale(root, scaleType);
    const chords: ScaleChord[] = [];
    
    // Generate triads for each scale degree
    scaleNotes.forEach((note, index) => {
      const noteName = MusicTheory.semitoneToNote(note);
      const chord: ScaleChord = {
        root: noteName,
        rootSemitone: note,
        degree: index + 1,
        notes: [
          note,
          scaleNotes[(index + 2) % scaleNotes.length],
          scaleNotes[(index + 4) % scaleNotes.length]
        ]
      };
      chords.push(chord);
    });
    
    return chords;
  };

  // Convert semitone to note name
  const semitoneToNote = (semitone: Semitone) => {
    return MusicTheory.semitoneToNote(semitone);
  };

  // Convert note name to semitone
  const noteToSemitone = (noteName: NoteName) => {
    return MusicTheory.noteToSemitone(noteName);
  };

  return {
    chordTypes,
    scaleTypes,
    availableNotes,
    generateChordNotes,
    generateScaleNotes,
    generateScaleChords,
    semitoneToNote,
    noteToSemitone,
  };
};