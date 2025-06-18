// ==================== MUSIC THEORY MODULE ====================

import type { NoteName, Semitone, ChordType, ScaleType, MusicalContext } from '../types';

const MusicTheory = {
  NOTES: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
  FLAT_NOTES: ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"],
  STANDARD_TUNING: [4, 9, 2, 7, 11, 4], // E A D G B E

  CHORD_FORMULAS: {
    major: [0, 4, 7],
    minor: [0, 3, 7],
    dim: [0, 3, 6],
    aug: [0, 4, 8],
    sus2: [0, 2, 7],
    sus4: [0, 5, 7],
    maj7: [0, 4, 7, 11],
    min7: [0, 3, 7, 10],
    dom7: [0, 4, 7, 10],
    dim7: [0, 3, 6, 9],
    maj9: [0, 4, 7, 11, 2],
    min9: [0, 3, 7, 10, 2],
    add9: [0, 4, 7, 2],
  },

  SCALE_FORMULAS: {
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10],
    dorian: [0, 2, 3, 5, 7, 9, 10],
    phrygian: [0, 1, 3, 5, 7, 8, 10],
    lydian: [0, 2, 4, 6, 7, 9, 11],
    mixolydian: [0, 2, 4, 5, 7, 9, 10],
    locrian: [0, 1, 3, 5, 6, 8, 10],
    pentatonic: [0, 2, 4, 7, 9],
    blues: [0, 3, 5, 6, 7, 10],
    harmonic_minor: [0, 2, 3, 5, 7, 8, 11],
    melodic_minor: [0, 2, 3, 5, 7, 9, 11],
  },

  TUNINGS: {
    Standard: [4, 9, 2, 7, 11, 4], // E A D G B E
    "Drop D": [2, 9, 2, 7, 11, 4], // D A D G B E
    DADGAD: [2, 9, 2, 7, 9, 2], // D A D G A D
    "Open C": [0, 7, 0, 7, 0, 4], // C G C G C E
    "Open G": [2, 7, 2, 7, 11, 2], // D G D G B D
    "Open D": [2, 9, 2, 6, 9, 2], // D A D F# A D
    cgBbgfc: [0, 7, 10, 7, 5, 0], // C G Bb G F C
  },

  noteToSemitone(noteName: NoteName): Semitone {
    const note = noteName.toUpperCase();
    let index = this.NOTES.indexOf(note);
    if (index === -1) {
      index = this.FLAT_NOTES.indexOf(note);
    }
    return index !== -1 ? index : 0;
  },

  semitoneToNote(semitone: Semitone, useFlats: boolean = false): NoteName {
    const notes = useFlats ? this.FLAT_NOTES : this.NOTES;
    return notes[semitone % 12];
  },

  // Key signatures that use sharps
  SHARP_KEYS: ['G', 'D', 'A', 'E', 'B', 'F#', 'C#'],
  
  // Key signatures that use flats  
  FLAT_KEYS: ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'],

  // Get theoretically correct note name based on musical context
  getContextualNoteName(semitone: Semitone, context: MusicalContext = {}): NoteName {
    const { key, scale } = context;
    
    // If no context provided, default to sharps (common in guitar music)
    if (!key) {
      return this.semitoneToNote(semitone, false);
    }
    
    // For scale contexts, always try to use the scale's proper note spelling first
    if (scale && key) {
      const scaleNoteName = this.getScaleNoteName(semitone, key, scale);
      if (scaleNoteName) {
        return scaleNoteName;
      }
      // If not found in scale, fall through to chromatic logic
    }
    
    // For chromatic notes (not in scale) or non-scale contexts,
    // use intelligent enharmonic choice based on key center
    return this.getIntelligentEnharmonic(semitone, key, scale);
  },

  // Get intelligent enharmonic spelling for chromatic notes
  getIntelligentEnharmonic(semitone, key, scale) {
    const normalizedSemitone = semitone % 12;
    
    // Determine preference based on key and scale type
    let prefersFlats = this.FLAT_KEYS.includes(key);
    
    // Special considerations for minor keys and modes
    if (scale) {
      // Minor keys often use different enharmonics than their relative major
      if (scale === 'minor') {
        prefersFlats = this.getMinorKeyFlatPreference(key);
      }
      // Modes inherit from their parent scale's preference
      else if (['dorian', 'phrygian', 'lydian', 'mixolydian', 'locrian'].includes(scale)) {
        prefersFlats = this.getModeKeyFlatPreference(key);
      }
    }
    
    // Special handling for ambiguous chromatic notes
    switch (normalizedSemitone) {
      case 1: // C#/Db
        return prefersFlats ? 'Db' : 'C#';
      case 3: // D#/Eb  
        return prefersFlats ? 'Eb' : 'D#';
      case 6: // F#/Gb
        return prefersFlats ? 'Gb' : 'F#';
      case 8: // G#/Ab
        return prefersFlats ? 'Ab' : 'G#';
      case 10: // A#/Bb
        return prefersFlats ? 'Bb' : 'A#';
      default:
        // For natural notes, no ambiguity
        return this.semitoneToNote(normalizedSemitone, false);
    }
  },

  // Determine flat preference for minor keys
  getMinorKeyFlatPreference(key) {
    // Natural minor keys that typically use flats for chromatic notes
    const flatMinorKeys = ['D', 'G', 'C', 'F', 'Bb', 'Eb', 'Ab'];
    return flatMinorKeys.includes(key);
  },

  // Determine flat preference for modal keys
  getModeKeyFlatPreference(key) {
    // For modes, consider what the parent major scale would be
    // This is a simplified approach - could be made more sophisticated
    return this.FLAT_KEYS.includes(key);
  },

  // Get note name from scale context (returns null if not in scale)
  getScaleNoteName(semitone, rootNote, scaleType) {
    const scaleNotes = this.generateScaleWithNames(rootNote, scaleType);
    const targetSemitone = semitone % 12;
    
    // Find the note in the generated scale
    const scaleNote = scaleNotes.find(note => note.semitone === targetSemitone);
    return scaleNote ? scaleNote.name : null; // Return null if not found in scale
  },

  // Generate a scale with proper note names (alphabetical sequence)
  generateScaleWithNames(rootNote, scaleType) {
    const rootSemitone = typeof rootNote === "string" ? this.noteToSemitone(rootNote) : rootNote;
    const rootNoteName = typeof rootNote === "string" ? rootNote : this.semitoneToNote(rootNote);
    const formula = this.SCALE_FORMULAS[scaleType] || this.SCALE_FORMULAS.major;
    
    // Base note letters in order
    const noteLetters = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    
    // Find starting letter
    const rootLetter = rootNoteName.charAt(0);
    const startIndex = noteLetters.indexOf(rootLetter);
    
    // Generate scale ensuring each letter is used exactly once
    const scaleNotes = [];
    
    formula.forEach((interval, index) => {
      const semitone = (rootSemitone + interval) % 12;
      const letterIndex = (startIndex + index) % 7;
      const targetLetter = noteLetters[letterIndex];
      
      // Find the correct enharmonic spelling for this letter
      const noteName = this.getEnharmonicForLetter(semitone, targetLetter);
      
      scaleNotes.push({
        semitone,
        name: noteName,
        letter: targetLetter,
        interval
      });
    });
    
    return scaleNotes;
  },

  // Get the correct enharmonic spelling for a specific letter
  getEnharmonicForLetter(semitone, targetLetter) {
    const normalizedSemitone = semitone % 12;
    
    // Map each semitone to possible note names
    const enharmonicMap = {
      0: ['C', 'B#', 'Dbb'],
      1: ['C#', 'Db', 'B##'],
      2: ['D', 'C##', 'Ebb'],
      3: ['D#', 'Eb', 'Fbb'],
      4: ['E', 'D##', 'Fb'],
      5: ['F', 'E#', 'Gbb'],
      6: ['F#', 'Gb', 'E##'],
      7: ['G', 'F##', 'Abb'],
      8: ['G#', 'Ab'],
      9: ['A', 'G##', 'Bbb'],
      10: ['A#', 'Bb', 'Cbb'],
      11: ['B', 'A##', 'Cb']
    };
    
    const possibleNames = enharmonicMap[normalizedSemitone] || [];
    
    // Find the name that starts with the target letter
    const match = possibleNames.find(name => name.charAt(0) === targetLetter);
    
    // If we find a match, use it; otherwise fall back to default
    return match || this.semitoneToNote(normalizedSemitone);
  },

  generateChord(rootNote: NoteName | Semitone, chordType: ChordType): Semitone[] {
    const rootSemitone =
      typeof rootNote === "string" ? this.noteToSemitone(rootNote) : rootNote;
    const formula = this.CHORD_FORMULAS[chordType] || this.CHORD_FORMULAS.major;
    return formula.map((interval) => (rootSemitone + interval) % 12);
  },

  generateScale(rootNote: NoteName | Semitone, scaleType: ScaleType): Semitone[] {
    const rootSemitone =
      typeof rootNote === "string" ? this.noteToSemitone(rootNote) : rootNote;
    const formula = this.SCALE_FORMULAS[scaleType] || this.SCALE_FORMULAS.major;
    return formula.map((interval) => (rootSemitone + interval) % 12);
  },

  findNotePositions(tuning, targetNotes, maxFrets = 24, context = {}) {
    const positions = [];
    tuning.forEach((openNote, stringIndex) => {
      for (let fret = 0; fret <= maxFrets; fret++) {
        const noteAtFret = (openNote + fret) % 12;
        if (targetNotes.includes(noteAtFret)) {
          positions.push({
            string: stringIndex,
            fret: fret,
            note: noteAtFret,
            noteName: this.getContextualNoteName(noteAtFret, context),
          });
        }
      }
    });
    return positions;
  },

  findRecommendedCapoPositions(
    tuning,
    targetNotes,
    maxFrets = 12,
    minStrings = 3
  ) {
    const recommendations = [];
    for (let fret = 1; fret <= maxFrets; fret++) {
      let matchingStrings = 0;
      tuning.forEach((openNote) => {
        const noteAtFret = (openNote + fret) % 12;
        if (targetNotes.includes(noteAtFret)) {
          matchingStrings++;
        }
      });

      if (matchingStrings >= minStrings) {
        recommendations.push({
          fret,
          matchingStrings,
          score: matchingStrings,
        });
      }
    }
    return recommendations.sort((a, b) => b.score - a.score);
  },

  getChordsInScale(rootNote, scaleType) {
    const rootSemitone =
      typeof rootNote === "string" ? this.noteToSemitone(rootNote) : rootNote;
    const scaleNotes = this.generateScale(rootSemitone, scaleType);
    const chords = [];

    // Create musical context for the scale
    const scaleContext = {
      key: typeof rootNote === "string" ? rootNote : this.semitoneToNote(rootSemitone),
      scale: scaleType
    };

    scaleNotes.forEach((note) => {
      const noteName = this.getContextualNoteName(note, scaleContext);

      Object.keys(this.CHORD_FORMULAS).forEach((chordType) => {
        const chordNotes = this.generateChord(note, chordType);
        const allNotesInScale = chordNotes.every((chordNote) =>
          scaleNotes.includes(chordNote)
        );

        if (allNotesInScale) {
          chords.push({
            root: note,
            rootName: noteName,
            type: chordType,
            name: `${noteName} ${chordType}`,
            notes: chordNotes,
          });
        }
      });
    });

    return chords.sort((a, b) => {
      const aIndex = scaleNotes.indexOf(a.root);
      const bIndex = scaleNotes.indexOf(b.root);
      if (aIndex !== bIndex) return aIndex - bIndex;
      return a.notes.length - b.notes.length;
    });
  },

  identifyChords(selectedNotes) {
    if (!selectedNotes || selectedNotes.length < 2) {
      return [];
    }

    const normalizedNotes = [...new Set(selectedNotes.map(note => note % 12))].sort();
    const matches = [];

    // Check all possible root notes
    for (let root = 0; root < 12; root++) {
      Object.keys(this.CHORD_FORMULAS).forEach((chordType) => {
        const chordNotes = this.generateChord(root, chordType);
        
        // Check if selected notes match this chord (allowing partial matches)
        const matchingNotes = normalizedNotes.filter(note => chordNotes.includes(note));
        const matchPercentage = matchingNotes.length / chordNotes.length;
        const coveragePercentage = matchingNotes.length / normalizedNotes.length;
        
        // Require at least 2 matching notes and good coverage
        if (matchingNotes.length >= 2 && coveragePercentage >= 0.6) {
          // Use context-aware note naming for the chord
          const chordContext = { key: this.semitoneToNote(root), chord: chordType };
          const rootName = this.getContextualNoteName(root, chordContext);
          
          matches.push({
            root,
            rootName,
            type: chordType,
            name: `${rootName} ${chordType}`,
            notes: chordNotes,
            matchingNotes,
            confidence: Math.round((matchPercentage * 0.7 + coveragePercentage * 0.3) * 100),
            isPartial: matchingNotes.length < chordNotes.length,
            hasExtraNotes: normalizedNotes.length > chordNotes.length
          });
        }
      });
    }

    // Check for inversions - try each selected note as potential root
    normalizedNotes.forEach(potentialRoot => {
      Object.keys(this.CHORD_FORMULAS).forEach((chordType) => {
        const chordNotes = this.generateChord(potentialRoot, chordType);
        const matchingNotes = normalizedNotes.filter(note => chordNotes.includes(note));
        const matchPercentage = matchingNotes.length / chordNotes.length;
        const coveragePercentage = matchingNotes.length / normalizedNotes.length;
        
        if (matchingNotes.length >= 2 && coveragePercentage >= 0.6) {
          const inversionName = potentialRoot !== normalizedNotes[0] ? " (inversion)" : "";
          
          // Use context-aware note naming for the chord
          const chordContext = { key: this.semitoneToNote(potentialRoot), chord: chordType };
          const rootName = this.getContextualNoteName(potentialRoot, chordContext);
          
          matches.push({
            root: potentialRoot,
            rootName,
            type: chordType,
            name: `${rootName} ${chordType}${inversionName}`,
            notes: chordNotes,
            matchingNotes,
            confidence: Math.round((matchPercentage * 0.7 + coveragePercentage * 0.3) * (inversionName ? 90 : 100)),
            isPartial: matchingNotes.length < chordNotes.length,
            hasExtraNotes: normalizedNotes.length > chordNotes.length,
            isInversion: inversionName !== ""
          });
        }
      });
    });

    // Remove duplicates and sort by confidence
    const uniqueMatches = matches.filter((match, index, self) => 
      index === self.findIndex(m => m.name === match.name)
    );

    return uniqueMatches
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 8); // Limit to top 8 matches
  },
};

export default MusicTheory;