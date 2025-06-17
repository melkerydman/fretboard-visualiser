import React, { useState, useMemo, useEffect } from "react";
import { GuitarProvider, useGuitar } from "../context/index.js";
// import { useGuitarCalculations } from '../hooks/guitar/index.js';
import { useMusicTheory } from "../hooks/music/index.js";
import { useTheme } from "../hooks/ui/useTheme.js";
import { Fretboard } from "../components/guitar/index.js";
import { SettingsModal } from "../components/ui/modals/index.js";
import { SettingsIcon } from "../components/ui/icons/index.js";
import MusicTheory from "../musicTheory.js";
import { STRING_LABELS } from "../constants/index.js";

// Custom Tuning Selector Component
const CustomTuningSelector = ({ tuning, onChange, settings }) => {
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
            {MusicTheory.NOTES.map((note, noteIndex) => (
              <option key={noteIndex} value={noteIndex}>
                {note}
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
  } = useGuitar();

  // UI State (separate from guitar context)
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    theme: "system",
    verticalFretboard: false,
    layoutSize: "comfortable",
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
      const noteName = MusicTheory.semitoneToNote(note);
      groupedChords[noteName] = {
        root: noteName,
        rootSemitone: note,
        degree: index + 1,
        chords: allChordsInScale.filter(chord => chord.rootName === noteName)
      };
    });

    console.log("Grouped scale chords:", groupedChords);
    return Object.values(groupedChords);
  }, [viewMode, selectedRoot, selectedScale]);

  // Event handlers
  const handleNoteClick = (noteData) => {
    console.log("Note clicked:", noteData);
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
                Notes:{" "}
                {selectedScaleChord.notes
                  .map((note) => MusicTheory.semitoneToNote(note))
                  .join(" ")}
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
            {currentTuning
              .map((note) => MusicTheory.semitoneToNote(note))
              .join("-")}{" "}
            (Low to High)
          </span>
          <span className={themeClasses.text}>
            <strong>Notes:</strong>{" "}
            {highlightedNotes
              .map((note) => MusicTheory.semitoneToNote(note))
              .join(" ")}
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

// Main App Container with Provider
const FretboardVisualizerApp = () => {
  return (
    <GuitarProvider>
      <FretboardVisualizerContent />
    </GuitarProvider>
  );
};

export default FretboardVisualizerApp;
