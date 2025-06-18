import { createContext, useContext, ReactNode } from 'react';
import MusicTheory from '../services/musicTheory';
import { useGuitar } from './GuitarContext';
import type { NoteName, ScaleType, ChordType, Semitone, Tuning, MusicalContext as MusicalContextType } from '../types';

interface MusicalContextValue {
  musicalContext: MusicalContextType;
  getNoteName: (semitone: Semitone, overrideContext?: MusicalContextType | null) => NoteName;
  getNoteNames: (semitones: Semitone[], overrideContext?: MusicalContextType | null) => NoteName[];
  formatNoteNames: (semitones: Semitone[], separator?: string, overrideContext?: MusicalContextType | null) => string;
  getNoteNameForPosition: (tuning: Tuning, string: number, fret: number, overrideContext?: MusicalContextType | null) => NoteName;
  currentKey: NoteName | null;
  currentScale: ScaleType | null;
  currentChord: ChordType | null;
  currentMode: string;
}

const MusicalContext = createContext<MusicalContextValue | null>(null);

interface MusicalContextProviderProps {
  children: ReactNode;
}

export const MusicalContextProvider = ({ children }: MusicalContextProviderProps) => {
  const { selectedRoot, selectedScale, selectedChord, viewMode } = useGuitar();
  
  // Create current musical context
  const musicalContext: MusicalContextType = {
    key: selectedRoot,
    scale: viewMode === "scale" ? selectedScale : undefined,
    chord: viewMode === "chord" ? selectedChord : undefined,
    mode: viewMode
  };

  // Smart note naming function that automatically uses current context
  const getNoteName = (semitone: Semitone, overrideContext: MusicalContextType | null = null) => {
    const context = overrideContext || musicalContext;
    return MusicTheory.getContextualNoteName(semitone, context);
  };

  // Get multiple note names at once
  const getNoteNames = (semitones: Semitone[], overrideContext: MusicalContextType | null = null) => {
    return semitones.map(semitone => getNoteName(semitone, overrideContext));
  };

  // Format note names for display (e.g., for chord display)
  const formatNoteNames = (semitones: Semitone[], separator = " ", overrideContext: MusicalContextType | null = null) => {
    return getNoteNames(semitones, overrideContext).join(separator);
  };

  // Get note name for a specific position (string + fret)
  const getNoteNameForPosition = (tuning: Tuning, string: number, fret: number, overrideContext: MusicalContextType | null = null) => {
    const semitone = (tuning[string] + fret) % 12;
    return getNoteName(semitone, overrideContext);
  };

  const value = {
    // Current context
    musicalContext,
    
    // Smart note naming functions
    getNoteName,
    getNoteNames,
    formatNoteNames,
    getNoteNameForPosition,
    
    // Convenience getters for current context values
    currentKey: selectedRoot,
    currentScale: viewMode === "scale" ? selectedScale : null,
    currentChord: viewMode === "chord" ? selectedChord : null,
    currentMode: viewMode
  };

  return (
    <MusicalContext.Provider value={value}>
      {children}
    </MusicalContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMusicalContext = (): MusicalContextValue => {
  const context = useContext(MusicalContext);
  if (!context) {
    throw new Error('useMusicalContext must be used within a MusicalContextProvider');
  }
  return context;
};