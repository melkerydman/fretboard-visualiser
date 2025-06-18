import { useMemo } from 'react';
import MusicTheory from '../../services/musicTheory.js';

export const useMusicTheory = () => {
  // Get available chord types
  const chordTypes = useMemo(() => {
    return Object.keys(MusicTheory.CHORD_FORMULAS);
  }, []);

  // Get available scale types
  const scaleTypes = useMemo(() => {
    return Object.keys(MusicTheory.SCALE_FORMULAS);
  }, []);

  // Get available notes
  const availableNotes = useMemo(() => {
    return MusicTheory.NOTES;
  }, []);

  // Generate chord notes
  const generateChordNotes = (root, chordType) => {
    return MusicTheory.generateChord(root, chordType);
  };

  // Generate scale notes
  const generateScaleNotes = (root, scaleType) => {
    return MusicTheory.generateScale(root, scaleType);
  };

  // Generate scale chords (chords within a scale)
  const generateScaleChords = (root, scaleType) => {
    const scaleNotes = MusicTheory.generateScale(root, scaleType);
    const chords = [];
    
    // Generate triads for each scale degree
    scaleNotes.forEach((note, index) => {
      const noteName = MusicTheory.semitoneToNote(note);
      const chord = {
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
  const semitoneToNote = (semitone) => {
    return MusicTheory.semitoneToNote(semitone);
  };

  // Convert note name to semitone
  const noteToSemitone = (noteName) => {
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