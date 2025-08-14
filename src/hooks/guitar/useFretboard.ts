import { useMemo } from 'react';
import MusicTheory from '../../services/musicTheory';
import type { Tuning, Capo, Semitone, NotePosition } from '../../types';

interface UseFretboardReturn {
  effectiveTuning: Tuning;
  notePositions: NotePosition[];
  getHighlightedPositions: (highlightedNotes: Semitone[]) => NotePosition[];
  isNoteGreyed: (stringIndex: number, fret: number) => boolean;
}

export const useFretboard = (
  tuning: Tuning, 
  capo: Capo | null, 
  maxFrets: number
): UseFretboardReturn => {
  // Calculate effective tuning considering capo
  const effectiveTuning = useMemo(() => {
    if (!capo) return tuning;
    
    return tuning.map((stringNote, stringIndex) => {
      const isCapoed = capo.fromHighE 
        ? stringIndex < capo.strings 
        : stringIndex >= (tuning.length - capo.strings);
      
      return isCapoed ? stringNote + capo.fret : stringNote;
    });
  }, [tuning, capo]);

  // Find all note positions on the fretboard
  const notePositions = useMemo(() => {
    const positions: NotePosition[] = [];
    
    for (let stringIndex = 0; stringIndex < tuning.length; stringIndex++) {
      for (let fret = 0; fret <= maxFrets; fret++) {
        const note = (tuning[stringIndex] + fret) % 12;
        positions.push({
          string: stringIndex,
          fret,
          note,
          noteName: MusicTheory.semitoneToNote(note),
        });
      }
    }
    
    return positions;
  }, [tuning, maxFrets]);

  // Filter positions for highlighted notes
  const getHighlightedPositions = (highlightedNotes: Semitone[]) => {
    return notePositions.filter(pos => highlightedNotes.includes(pos.note));
  };

  // Check if a note position is greyed out due to capo
  const isNoteGreyed = (stringIndex: number, fret: number) => {
    if (!capo) return false;
    
    const isCapoedString = capo.fromHighE 
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