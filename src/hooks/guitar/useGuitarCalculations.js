import { useMemo } from 'react';
import MusicTheory from '../../musicTheory.js';

export const useGuitarCalculations = (tuning, capo, maxFrets) => {
  // Calculate effective tuning considering capo
  const effectiveTuning = useMemo(() => {
    if (!capo) return tuning;
    
    return tuning.map((stringNote, stringIndex) => {
      const isCapoed = capo.fromTop 
        ? stringIndex < capo.strings 
        : stringIndex >= (tuning.length - capo.strings);
      
      return isCapoed ? stringNote + capo.fret : stringNote;
    });
  }, [tuning, capo]);

  // Find all note positions on the fretboard
  const notePositions = useMemo(() => {
    const positions = [];
    
    for (let stringIndex = 0; stringIndex < tuning.length; stringIndex++) {
      for (let fret = 0; fret <= maxFrets; fret++) {
        const note = (tuning[stringIndex] + fret) % 12;
        positions.push({
          string: stringIndex,
          fret,
          note,
          semitone: note,
          noteName: MusicTheory.semitoneToNote(note),
        });
      }
    }
    
    return positions;
  }, [tuning, maxFrets]);

  // Filter positions for highlighted notes
  const getHighlightedPositions = (highlightedNotes) => {
    return notePositions.filter(pos => highlightedNotes.includes(pos.note));
  };

  // Check if a note position is greyed out due to capo
  const isNoteGreyed = (stringIndex, fret) => {
    if (!capo) return false;
    
    const isCapoedString = capo.fromTop 
      ? stringIndex < capo.strings 
      : stringIndex >= (tuning.length - capo.strings);
    
    return isCapoedString && fret < capo.fret;
  };

  return {
    effectiveTuning,
    notePositions,
    getHighlightedPositions,
    isNoteGreyed,
  };
};