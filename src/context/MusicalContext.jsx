import React, { createContext, useContext } from 'react';
import MusicTheory from '../musicTheory.js';
import { useGuitar } from './GuitarContext.jsx';

const MusicalContext = createContext();

export const MusicalContextProvider = ({ children }) => {
  const { selectedRoot, selectedScale, selectedChord, viewMode } = useGuitar();
  
  // Create current musical context
  const musicalContext = {
    key: selectedRoot,
    scale: viewMode === "scale" ? selectedScale : null,
    chord: viewMode === "chord" ? selectedChord : null,
    mode: viewMode
  };

  // Smart note naming function that automatically uses current context
  const getNoteName = (semitone, overrideContext = null) => {
    const context = overrideContext || musicalContext;
    return MusicTheory.getContextualNoteName(semitone, context);
  };

  // Get multiple note names at once
  const getNoteNames = (semitones, overrideContext = null) => {
    return semitones.map(semitone => getNoteName(semitone, overrideContext));
  };

  // Format note names for display (e.g., for chord display)
  const formatNoteNames = (semitones, separator = " ", overrideContext = null) => {
    return getNoteNames(semitones, overrideContext).join(separator);
  };

  // Get note name for a specific position (string + fret)
  const getNoteNameForPosition = (tuning, string, fret, overrideContext = null) => {
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
export const useMusicalContext = () => {
  const context = useContext(MusicalContext);
  if (!context) {
    throw new Error('useMusicalContext must be used within a MusicalContextProvider');
  }
  return context;
};