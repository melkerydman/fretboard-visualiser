import React, { useState, useMemo, useEffect } from "react";
import { GuitarProvider, useGuitar } from "../context/index.js";
import { MusicalContextProvider } from "../context/MusicalContext.jsx";
// import { useGuitarCalculations } from '../hooks/guitar/index.js';
import { useMusicTheory } from "../hooks/music/index.js";
import { useTheme } from "../hooks/ui/useTheme.js";
import { useMusicalContext } from "../context/MusicalContext.jsx";
import { Fretboard } from "../components/guitar/index.js";
import { SettingsModal } from "../components/ui/modals/index.js";
import { SettingsIcon } from "../components/ui/icons/index.js";
import MusicTheory from "../musicTheory.js";
import { STRING_LABELS } from "../constants/index.js";

// Custom Tuning Selector Component
const CustomTuningSelector = ({ tuning, onChange, settings }) => {
  const { getNoteName } = useMusicalContext();
  
  return (
    <div className="space-y-2">
      <label
        className={`block text-sm font-medium ${
          settings.darkMode ? "text-gray-200" : "text-gray-700"
        }`}
      >
        Custom Tuning
      </label>
      <div className="grid grid-cols-6 gap-2">
        {tuning.map((semitone, index) => (
          <select
            key={index}
            value={semitone}
            onChange={(e) => {
              const newTuning = [...tuning];
              newTuning[index] = parseInt(e.target.value);
              onChange(newTuning);
            }}
            className={`p-1 rounded border text-sm ${
              settings.darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            {MusicTheory.NOTES.map((_, noteIndex) => (
              <option key={noteIndex} value={noteIndex}>
                {getNoteName(noteIndex)}
              </option>
            ))}
          </select>
        ))}
      </div>
      <div className="text-xs text-gray-500 grid grid-cols-6 gap-2">
        {STRING_LABELS.map((label, index) => (
          <span key={index} className="text-center">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

// Main Fretboard Visualizer Component (uses context)
const FretboardVisualizerContent = () => {
  const {
    // State
    selectedRoot,
    selectedChord,
    selectedScale,
    viewMode,
    selectedScaleChord,
    selectedTuning,
    customTuning,
    capo,
    maxFrets,
    hoveredNote,
    // Chord Identifier State
    identifiedChords,
    showAllNotes,
    includeCapoNotes,
    effectiveSelectedNotes,
    // Computed values
    currentTuning,
    highlightedNotes,
    recommendedCapoPositions,
    // Actions
    setSelectedRoot,
    setSelectedChord,
    setSelectedScale,
    setSelectedTuning,
    setCustomTuning,
    setCapo,
    setMaxFrets,
    setHoveredNote,
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
  } = useGuitar();

  // Musical context for smart note naming
  const { getNoteName, formatNoteNames } = useMusicalContext();

  // UI State (separate from guitar context)
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    theme: "system",
    verticalFretboard: false,
    layoutSize: "comfortable",
    leftHanded: false,
  });

  // Theme hook
  const { themeClasses, darkMode, theme, setTheme } = useTheme(settings.theme);

  // Music theory hook
  const { chordTypes, scaleTypes, availableNotes } = useMusicTheory();

  // Guitar calculations hook (available for future use)
  // const { isNoteGreyed } = useGuitarCalculations(currentTuning, capo, maxFrets);

  // Update settings with computed dark mode and sync theme
  useEffect(() => {
    setSettings((prev) => ({ ...prev, darkMode, theme }));
  }, [darkMode, theme]);

  // Sync theme changes from settings to hook
  useEffect(() => {
    if (settings.theme !== theme) {
      setTheme(settings.theme);
    }
  }, [settings.theme, theme, setTheme]);

  // Computed scale chords for scale view
  const scaleChords = useMemo(() => {
    if (viewMode !== "scale") return [];

    const allChordsInScale = MusicTheory.getChordsInScale(selectedRoot, selectedScale);
    console.log("All chords in scale:", allChordsInScale, "for", selectedRoot, selectedScale);
    
    // Group chords by root note
    const groupedChords = {};
    const scaleNotes = MusicTheory.generateScale(selectedRoot, selectedScale);
    
    scaleNotes.forEach((note, index) => {
      const noteName = getNoteName(note);
      groupedChords[noteName] = {
        root: noteName,
        rootSemitone: note,
        degree: index + 1,
        chords: allChordsInScale.filter(chord => chord.rootName === noteName)
      };
    });

    console.log("Grouped scale chords:", groupedChords);
    return Object.values(groupedChords);
  }, [viewMode, selectedRoot, selectedScale, getNoteName]);

  // Event handlers
  const handleNoteClick = (noteData) => {
    if (viewMode === "identifier") {
      toggleNoteSelection(noteData);
    } else {
      console.log("Note clicked:", noteData);
    }
  };

  const handleNoteHover = (noteData) => {
    setHoveredNote(noteData);
  };

  const handleCapoMove = (newCapo) => {
    setCapo(newCapo);
  };

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
  };

  // Render dashboard content (controls, status, scale chords, capo controls)
  const renderDashboard = () => (
    <>
      {/* Mode Selection */}
      <div className="flex space-x-2">
        <button
          onClick={() => handleViewModeChange("chord")}
          className={`px-4 py-2 rounded font-medium transition-colors border ${
            viewMode === "chord"
              ? "bg-blue-500 text-white border-blue-500"
              : `${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} hover:bg-opacity-80`
          }`}
        >
          Chord Mode
        </button>
        <button
          onClick={() => handleViewModeChange("scale")}
          className={`px-4 py-2 rounded font-medium transition-colors border ${
            viewMode === "scale"
              ? "bg-blue-500 text-white border-blue-500"
              : `${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} hover:bg-opacity-80`
          }`}
        >
          Scale Mode
        </button>
        <button
          onClick={() => handleViewModeChange("identifier")}
          className={`px-4 py-2 rounded font-medium transition-colors border ${
            viewMode === "identifier"
              ? "bg-blue-500 text-white border-blue-500"
              : `${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} hover:bg-opacity-80`
          }`}
        >
          Identifier
        </button>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Root Note Selection */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${themeClasses.text}`}
          >
            Root Note
          </label>
          <select
            value={selectedRoot}
            onChange={(e) => setSelectedRoot(e.target.value)}
            className={`w-full p-2 rounded border ${themeClasses.input}`}
          >
            {availableNotes.map((note) => (
              <option key={note} value={note}>
                {note}
              </option>
            ))}
          </select>
        </div>

        {/* Chord/Scale Selection */}
        {viewMode === "chord" ? (
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${themeClasses.text}`}
            >
              Chord Type
            </label>
            <select
              value={selectedChord}
              onChange={(e) => setSelectedChord(e.target.value)}
              className={`w-full p-2 rounded border ${themeClasses.input}`}
            >
              {chordTypes.map((chord) => (
                <option key={chord} value={chord}>
                  {chord}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${themeClasses.text}`}
            >
              Scale Type
            </label>
            <select
              value={selectedScale}
              onChange={(e) => setSelectedScale(e.target.value)}
              className={`w-full p-2 rounded border ${themeClasses.input}`}
            >
              {scaleTypes.map((scale) => (
                <option key={scale} value={scale}>
                  {scale}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Tuning Selection */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${themeClasses.text}`}
          >
            Tuning
          </label>
          <select
            value={selectedTuning}
            onChange={(e) => setSelectedTuning(e.target.value)}
            className={`w-full p-2 rounded border ${themeClasses.input}`}
          >
            {Object.keys(MusicTheory.TUNINGS).map((tuning) => (
              <option key={tuning} value={tuning}>
                {tuning}
              </option>
            ))}
            <option value="Custom">Custom</option>
          </select>
        </div>

        {/* Max Frets */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${themeClasses.text}`}
          >
            Max Frets
          </label>
          <input
            type="number"
            min="12"
            max="24"
            value={maxFrets}
            onChange={(e) => setMaxFrets(parseInt(e.target.value) || 12)}
            className={`w-full p-2 rounded border ${themeClasses.input}`}
          />
        </div>
      </div>

      {/* Chord Identifier Controls */}
      {viewMode === "identifier" && (
        <div className={`${themeClasses.cardBg} rounded-lg shadow-lg p-4 border ${themeClasses.border}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-medium ${themeClasses.text}`}>
              Chord Identifier
            </h3>
            <div className="flex items-center space-x-3 flex-wrap">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showAllNotes}
                  onChange={toggleShowAllNotes}
                  className="mr-2 text-blue-600"
                />
                <span className={`text-sm ${themeClasses.text}`}>
                  Show all notes
                </span>
              </label>
              {capo && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeCapoNotes}
                    onChange={toggleIncludeCapoNotes}
                    className="mr-2 text-blue-600"
                  />
                  <span className={`text-sm ${themeClasses.text}`}>
                    Include capo notes
                  </span>
                </label>
              )}
              <button
                onClick={clearSelectedNotes}
                className={`px-3 py-1 rounded text-sm transition-colors ${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} hover:bg-opacity-80`}
              >
                Clear Notes
              </button>
            </div>
          </div>
          
          {/* Selected Notes Display */}
          <div className="mb-4">
            <div className={`text-sm font-medium mb-2 ${themeClasses.text}`}>
              Selected Notes ({effectiveSelectedNotes.length}):
            </div>
            <div className="flex flex-wrap gap-2">
              {effectiveSelectedNotes.length > 0 ? (
                effectiveSelectedNotes.map((pos, index) => (
                  <button
                    key={index}
                    onClick={() => pos.isCapo ? null : removeSelectedNote(pos.note)}
                    className={`px-2 py-1 rounded text-sm transition-colors ${
                      pos.isCapo 
                        ? "bg-orange-600 text-white cursor-default"
                        : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                    }`}
                    title={pos.isCapo 
                      ? `Capo note: ${getNoteName(pos.note)} on String ${pos.string + 1}, Fret ${pos.fret}`
                      : `Click to remove ${getNoteName(pos.note)} from String ${pos.string + 1}, Fret ${pos.fret}`
                    }
                  >
                    {getNoteName(pos.note)}{pos.isCapo ? ' 🎸' : ' ×'}
                  </button>
                ))
              ) : (
                <span className={`text-sm ${themeClasses.textSecondary}`}>
                  Click notes on the fretboard to identify chords
                </span>
              )}
            </div>
          </div>
          
          {/* Identified Chords */}
          {identifiedChords.length > 0 && (
            <div>
              <div className={`text-sm font-medium mb-3 ${themeClasses.text}`}>
                Possible Chords:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {identifiedChords.map((chord, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded border ${themeClasses.cardBg} ${themeClasses.border}`}
                  >
                    <div className={`font-medium ${themeClasses.text} flex items-center justify-between`}>
                      <span>{chord.name}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        chord.confidence >= 80 ? "bg-green-500" : 
                        chord.confidence >= 60 ? "bg-yellow-500" : "bg-red-500"
                      } text-white`}>
                        {chord.confidence}%
                      </span>
                    </div>
                    <div className={`text-xs mt-1 ${themeClasses.textSecondary}`}>
                      Notes: {formatNoteNames(chord.notes)}
                    </div>
                    {chord.isPartial && (
                      <div className="text-xs text-orange-500 mt-1">
                        Partial match
                      </div>
                    )}
                    {chord.hasExtraNotes && (
                      <div className="text-xs text-blue-500 mt-1">
                        Has extra notes
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Custom Tuning Selector */}
      {selectedTuning === "Custom" && (
        <CustomTuningSelector
          tuning={customTuning}
          onChange={setCustomTuning}
          settings={settings}
        />
      )}

      {/* Scale Chords (Scale Mode Only) */}
      {viewMode === "scale" && scaleChords.length > 0 && (
        <div>
          <label
            className={`block text-sm font-medium mb-4 ${themeClasses.text}`}
          >
            Chords in {selectedRoot} {selectedScale}
          </label>
          
          {/* Horizontal layout: chords horizontally, chord types vertically */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 sm:gap-3">
            {scaleChords.map((scaleChord) => (
              <div key={scaleChord.root} className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-2`}>
                <h4 className={`font-medium ${themeClasses.text} text-center mb-1 text-sm`}>
                  {scaleChord.root}
                </h4>
                <div className={`text-xs ${themeClasses.textSecondary} text-center mb-2`}>
                  ({scaleChord.degree})
                </div>
                <div className="space-y-1">
                  {scaleChord.chords.map((chord, chordIndex) => (
                    <button
                      key={`${scaleChord.root}-${chord.type}-${chordIndex}`}
                      onClick={() => handleScaleChordSelect(chord)}
                      className={`w-full px-1 py-1 rounded text-xs transition-colors border ${
                        selectedScaleChord === chord
                          ? "bg-blue-500 text-white border-blue-500"
                          : `${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} hover:bg-blue-100 dark:hover:bg-gray-600`
                      }`}
                    >
                      {chord.type}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Selected Scale Chord Information */}
          {selectedScaleChord && (
            <div
              className={`mt-4 p-3 rounded-md border ${themeClasses.cardBg} ${themeClasses.border}`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-medium ${themeClasses.text}`}>
                  Selected: {selectedScaleChord.name}
                </span>
                <button
                  onClick={() => handleScaleChordSelect(null)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} hover:bg-opacity-80`}
                >
                  Clear
                </button>
              </div>
              <div className={`text-xs mt-1 ${themeClasses.textSecondary}`}>
                Notes: {formatNoteNames(selectedScaleChord.notes)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Status Information Panel */}
      <div
        className={`${themeClasses.cardBg} rounded-lg shadow-lg p-4 border ${themeClasses.border}`}
      >
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className={themeClasses.text}>
            <strong>Current:</strong> {selectedRoot}{" "}
            {viewMode === "chord" ? selectedChord : selectedScale}
            {selectedScaleChord && ` → ${selectedScaleChord.name}`}
          </span>
          <span className={themeClasses.text}>
            <strong>Tuning:</strong>{" "}
            {formatNoteNames(currentTuning, "-")}{" "}
            (Low to High)
          </span>
          <span className={themeClasses.text}>
            <strong>Notes:</strong>{" "}
            {formatNoteNames(highlightedNotes)}
          </span>
          {capo && (
            <span className={themeClasses.text}>
              <strong>Capo:</strong> Fret {capo.fret}, {capo.strings} strings
              from {capo.fromTop ? "top" : "bottom"}
            </span>
          )}
          {hoveredNote && (
            <span className={themeClasses.textSecondary}>
              <strong>Hovered:</strong> {hoveredNote.noteName} (String{" "}
              {hoveredNote.string + 1}, Fret {hoveredNote.fret})
            </span>
          )}
        </div>
      </div>

      {/* Capo Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <button
          onClick={capo ? removeCapo : addCapo}
          className={`px-4 py-2 rounded font-medium transition-colors ${
            capo ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          {capo ? "Remove Capo" : "Add Capo"}
        </button>

        {capo && (
          <>
            <div className="flex items-center space-x-2">
              <label className={`text-sm ${themeClasses.text}`}>
                Strings:
              </label>
              <select
                value={capo.strings}
                onChange={(e) => updateCapoStrings(parseInt(e.target.value))}
                className={`p-1 rounded border text-sm ${themeClasses.input}`}
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={toggleCapoDirection}
              className={`px-3 py-1 rounded text-sm transition-colors ${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} hover:bg-opacity-80`}
            >
              {capo.fromTop ? "From Top" : "From Bottom"}
            </button>
          </>
        )}
      </div>
    </>
  );

  // Render fretboard
  const renderFretboard = () => (
    <Fretboard
      tuning={currentTuning}
      capo={capo}
      highlightedNotes={highlightedNotes}
      selectedNotes={effectiveSelectedNotes}
      maxFrets={maxFrets}
      onNoteClick={handleNoteClick}
      onNoteHover={handleNoteHover}
      onCapoMove={handleCapoMove}
      recommendedCapoPositions={recommendedCapoPositions}
      settings={settings}
    />
  );

  const isSpacious = settings.layoutSize === "spacious";
  const isVertical = settings.verticalFretboard;
  const useSideBySide = isSpacious && isVertical;

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${themeClasses.bg}`}
    >
      <div className={`container mx-auto p-4 ${useSideBySide ? '' : 'space-y-6'}`}>
        {/* Header */}
        <div
          className={`flex justify-between items-center ${themeClasses.text} ${useSideBySide ? 'mb-6' : ''}`}
        >
          <h1 className="text-3xl font-bold">Guitar Fretboard Visualizer</h1>
          <button
            onClick={() => setShowSettings(true)}
            className={`p-2 rounded-lg transition-colors ${themeClasses.button}`}
          >
            <SettingsIcon />
          </button>
        </div>

        {useSideBySide ? (
          /* Side-by-side layout for spacious + vertical (only on lg+ screens) */
          <div className="lg:flex lg:gap-8 lg:h-full space-y-6 lg:space-y-0">
            {/* Dashboard Column - takes available space */}
            <div className="lg:flex-1 space-y-6 lg:overflow-y-auto lg:max-h-screen lg:min-w-0">
              {renderDashboard()}
            </div>
            
            {/* Fretboard Column - only takes space it needs */}
            <div className="lg:flex-shrink-0 lg:flex lg:items-start lg:justify-center">
              {renderFretboard()}
            </div>
          </div>
        ) : (
          /* Standard vertical layout */
          <div className="space-y-6">
            {renderDashboard()}
            {renderFretboard()}
          </div>
        )}
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
};

// Main App Container with Providers
const FretboardVisualizerApp = () => {
  return (
    <GuitarProvider>
      <MusicalContextProvider>
        <FretboardVisualizerContent />
      </MusicalContextProvider>
    </GuitarProvider>
  );
};

export default FretboardVisualizerApp;
