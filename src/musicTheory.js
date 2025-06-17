// ==================== MUSIC THEORY MODULE ====================

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

  noteToSemitone(noteName) {
    const note = noteName.toUpperCase();
    let index = this.NOTES.indexOf(note);
    if (index === -1) {
      index = this.FLAT_NOTES.indexOf(note);
    }
    return index !== -1 ? index : 0;
  },

  semitoneToNote(semitone, useFlats = false) {
    const notes = useFlats ? this.FLAT_NOTES : this.NOTES;
    return notes[semitone % 12];
  },

  generateChord(rootNote, chordType) {
    const rootSemitone =
      typeof rootNote === "string" ? this.noteToSemitone(rootNote) : rootNote;
    const formula = this.CHORD_FORMULAS[chordType] || this.CHORD_FORMULAS.major;
    return formula.map((interval) => (rootSemitone + interval) % 12);
  },

  generateScale(rootNote, scaleType) {
    const rootSemitone =
      typeof rootNote === "string" ? this.noteToSemitone(rootNote) : rootNote;
    const formula = this.SCALE_FORMULAS[scaleType] || this.SCALE_FORMULAS.major;
    return formula.map((interval) => (rootSemitone + interval) % 12);
  },

  findNotePositions(tuning, targetNotes, maxFrets = 24) {
    const positions = [];
    tuning.forEach((openNote, stringIndex) => {
      for (let fret = 0; fret <= maxFrets; fret++) {
        const noteAtFret = (openNote + fret) % 12;
        if (targetNotes.includes(noteAtFret)) {
          positions.push({
            string: stringIndex,
            fret: fret,
            note: noteAtFret,
            noteName: this.semitoneToNote(noteAtFret),
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

    scaleNotes.forEach((note) => {
      const noteName = this.semitoneToNote(note);

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
          matches.push({
            root,
            rootName: this.semitoneToNote(root),
            type: chordType,
            name: `${this.semitoneToNote(root)} ${chordType}`,
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
          matches.push({
            root: potentialRoot,
            rootName: this.semitoneToNote(potentialRoot),
            type: chordType,
            name: `${this.semitoneToNote(potentialRoot)} ${chordType}${inversionName}`,
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