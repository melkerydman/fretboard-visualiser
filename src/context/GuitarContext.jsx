import React, { createContext, useContext, useState, useMemo } from 'react';
import MusicTheory from '../musicTheory.js';

const GuitarContext = createContext();

export const useGuitar = () => {
  const context = useContext(GuitarContext);
  if (!context) {
    throw new Error('useGuitar must be used within a GuitarProvider');
  }
  return context;
};

export const GuitarProvider = ({ children }) => {
  // Music Theory State
  const [selectedRoot, setSelectedRoot] = useState("C");
  const [selectedChord, setSelectedChord] = useState("major");
  const [selectedScale, setSelectedScale] = useState("major");
  const [viewMode, setViewMode] = useState("chord");
  const [selectedScaleChord, setSelectedScaleChord] = useState(null);

  // Guitar Configuration
  const [selectedTuning, setSelectedTuning] = useState("Standard");
  const [customTuning, setCustomTuning] = useState(MusicTheory.STANDARD_TUNING);
  const [capo, setCapo] = useState(null);
  const [maxFrets, setMaxFrets] = useState(12);

  // UI State
  const [hoveredNote, setHoveredNote] = useState(null);

  // Computed Values
  const currentTuning = useMemo(() => {
    if (selectedTuning === "Custom") {
      return customTuning;
    }
    return MusicTheory.TUNINGS[selectedTuning] || MusicTheory.TUNINGS.Standard;
  }, [selectedTuning, customTuning]);

  const highlightedNotes = useMemo(() => {
    if (viewMode === "chord") {
      return MusicTheory.generateChord(selectedRoot, selectedChord);
    } else if (selectedScaleChord) {
      return selectedScaleChord.notes;
    } else {
      return MusicTheory.generateScale(selectedRoot, selectedScale);
    }
  }, [viewMode, selectedRoot, selectedChord, selectedScale, selectedScaleChord]);

  const recommendedCapoPositions = useMemo(() => {
    return MusicTheory.findRecommendedCapoPositions(
      currentTuning,
      highlightedNotes,
      maxFrets
    );
  }, [currentTuning, highlightedNotes, maxFrets]);

  // Complex Action Functions
  const addCapo = () => {
    setCapo({ fret: 3, strings: 6, fromTop: true });
  };

  const removeCapo = () => {
    setCapo(null);
  };

  const updateCapoStrings = (strings) => {
    setCapo(prev => prev ? { ...prev, strings } : null);
  };

  const toggleCapoDirection = () => {
    setCapo(prev => prev ? { ...prev, fromTop: !prev.fromTop } : null);
  };

  const handleScaleChordSelect = (chord) => {
    setSelectedScaleChord(chord);
  };

  const handleViewModeChange = (newMode) => {
    setViewMode(newMode);
    if (newMode === "chord") {
      setSelectedScaleChord(null);
    }
  };

  const value = {
    // Music Theory State
    selectedRoot,
    selectedChord,
    selectedScale,
    viewMode,
    selectedScaleChord,

    // Guitar Configuration
    selectedTuning,
    customTuning,
    capo,
    maxFrets,

    // UI State
    hoveredNote,

    // Computed Values
    currentTuning,
    highlightedNotes,
    recommendedCapoPositions,

    // Basic Actions
    setSelectedRoot,
    setSelectedChord,
    setSelectedScale,
    setViewMode,
    setSelectedScaleChord,
    setSelectedTuning,
    setCustomTuning,
    setCapo,
    setMaxFrets,
    setHoveredNote,

    // Complex Actions
    addCapo,
    removeCapo,
    updateCapoStrings,
    toggleCapoDirection,
    handleScaleChordSelect,
    handleViewModeChange,
  };

  return (
    <GuitarContext.Provider value={value}>
      {children}
    </GuitarContext.Provider>
  );
};