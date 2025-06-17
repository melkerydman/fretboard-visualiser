import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
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

  // Chord Identifier State
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [identifiedChords, setIdentifiedChords] = useState([]);
  const [showAllNotes, setShowAllNotes] = useState(false);
  const [includeCapoNotes, setIncludeCapoNotes] = useState(true);

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
    if (viewMode === "identifier") {
      if (showAllNotes) {
        // Show all chromatic notes when toggle is enabled
        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      } else {
        // Show notes from the current scale
        return MusicTheory.generateScale(selectedRoot, selectedScale);
      }
    } else if (viewMode === "chord") {
      return MusicTheory.generateChord(selectedRoot, selectedChord);
    } else if (selectedScaleChord) {
      return selectedScaleChord.notes;
    } else {
      return MusicTheory.generateScale(selectedRoot, selectedScale);
    }
  }, [viewMode, selectedRoot, selectedChord, selectedScale, selectedScaleChord, showAllNotes]);

  const recommendedCapoPositions = useMemo(() => {
    return MusicTheory.findRecommendedCapoPositions(
      currentTuning,
      highlightedNotes,
      maxFrets
    );
  }, [currentTuning, highlightedNotes, maxFrets]);

  // Computed capo notes for chord identification
  const capoNotes = useMemo(() => {
    if (!capo || !includeCapoNotes || viewMode !== "identifier") {
      return [];
    }

    const capoPositions = [];
    
    // Determine which logical strings are covered
    if (capo.fromTop) {
      // Cover highest-numbered strings (thin strings)
      for (let stringIndex = currentTuning.length - capo.strings; stringIndex < currentTuning.length; stringIndex++) {
        const openNote = currentTuning[stringIndex];
        const noteAtCapo = (openNote + capo.fret) % 12;
        
        capoPositions.push({
          string: stringIndex,
          fret: capo.fret,
          note: noteAtCapo,
          noteName: MusicTheory.semitoneToNote(noteAtCapo),
          isCapo: true
        });
      }
    } else {
      // Cover lowest-numbered strings (thick strings)
      for (let stringIndex = 0; stringIndex < capo.strings; stringIndex++) {
        const openNote = currentTuning[stringIndex];
        const noteAtCapo = (openNote + capo.fret) % 12;
        
        capoPositions.push({
          string: stringIndex,
          fret: capo.fret,
          note: noteAtCapo,
          noteName: MusicTheory.semitoneToNote(noteAtCapo),
          isCapo: true
        });
      }
    }

    return capoPositions;
  }, [capo, includeCapoNotes, viewMode, currentTuning]);

  // Combined notes for chord identification (manual selections + capo notes, with manual taking precedence)
  const effectiveSelectedNotes = useMemo(() => {
    if (viewMode !== "identifier") return selectedNotes;

    const combined = [...selectedNotes];
    
    // Add capo notes, but only if there's no manual selection on that string (any fret)
    capoNotes.forEach(capoNote => {
      const hasManualSelectionOnString = selectedNotes.some(pos => 
        pos.string === capoNote.string
      );
      
      if (!hasManualSelectionOnString) {
        combined.push(capoNote);
      }
    });

    return combined;
  }, [selectedNotes, capoNotes, viewMode]);

  // Auto-update chord identification when effective notes change
  useEffect(() => {
    if (viewMode === "identifier" && effectiveSelectedNotes.length > 0) {
      const noteValues = effectiveSelectedNotes.map(pos => pos.note);
      const chords = MusicTheory.identifyChords(noteValues);
      setIdentifiedChords(chords);
    } else {
      setIdentifiedChords([]);
    }
  }, [effectiveSelectedNotes, viewMode]);

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
    if (newMode !== "identifier") {
      setSelectedNotes([]);
      setIdentifiedChords([]);
    }
  };

  // Chord Identifier Actions
  const toggleNoteSelection = (positionData) => {
    setSelectedNotes(prev => {
      // Check if this exact position is already selected
      const isSelected = prev.some(pos => 
        pos.string === positionData.string && pos.fret === positionData.fret
      );
      
      if (isSelected) {
        // Remove the selected note
        return prev.filter(pos => !(pos.string === positionData.string && pos.fret === positionData.fret));
      } else {
        // Remove any existing selection on this string, then add the new one
        const filteredNotes = prev.filter(pos => pos.string !== positionData.string);
        return [...filteredNotes, positionData];
      }
    });
  };

  const clearSelectedNotes = () => {
    setSelectedNotes([]);
    setIdentifiedChords([]);
  };

  const toggleShowAllNotes = () => {
    setShowAllNotes(prev => !prev);
  };

  const removeSelectedNote = (noteValue) => {
    setSelectedNotes(prev => {
      const newSelection = prev.filter(pos => pos.note !== noteValue);
      
      // Chord identification will be auto-updated by useEffect
      
      return newSelection;
    });
  };

  const toggleIncludeCapoNotes = () => {
    setIncludeCapoNotes(prev => !prev);
  };

  const value = {
    // Music Theory State
    selectedRoot,
    selectedChord,
    selectedScale,
    viewMode,
    selectedScaleChord,

    // Chord Identifier State
    selectedNotes,
    identifiedChords,
    showAllNotes,
    includeCapoNotes,
    effectiveSelectedNotes,

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
    toggleNoteSelection,
    clearSelectedNotes,
    toggleShowAllNotes,
    removeSelectedNote,
    toggleIncludeCapoNotes,
  };

  return (
    <GuitarContext.Provider value={value}>
      {children}
    </GuitarContext.Provider>
  );
};