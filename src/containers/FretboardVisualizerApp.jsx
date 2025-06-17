import React, { useState, useMemo, useEffect } from 'react';
import { GuitarProvider, useGuitar } from '../context/index.js';
// import { useGuitarCalculations } from '../hooks/guitar/index.js';
import { useMusicTheory } from '../hooks/music/index.js';
import { useTheme } from '../hooks/ui/useTheme.js';
import { Fretboard } from '../components/guitar/index.js';
import { SettingsModal } from '../components/ui/modals/index.js';
import { SettingsIcon } from '../components/ui/icons/index.js';
import MusicTheory from '../musicTheory.js';
import { STRING_LABELS } from '../constants/index.js';

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
  const { themeClasses, darkMode } = useTheme(settings.theme);

  // Music theory hook
  const {
    chordTypes,
    scaleTypes,
    availableNotes,
    generateScaleChords,
  } = useMusicTheory();

  // Guitar calculations hook (available for future use)
  // const { isNoteGreyed } = useGuitarCalculations(currentTuning, capo, maxFrets);

  // Update settings with computed dark mode
  useEffect(() => {
    setSettings(prev => ({ ...prev, darkMode }));
  }, [darkMode]);

  // Computed scale chords for scale view
  const scaleChords = useMemo(() => {
    if (viewMode !== "scale") return [];
    return generateScaleChords(selectedRoot, selectedScale);
  }, [viewMode, selectedRoot, selectedScale, generateScaleChords]);

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

  return (
    <div className={`min-h-screen transition-colors duration-200 ${themeClasses.bg}`}>
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className={`flex justify-between items-center ${themeClasses.text}`}>
          <h1 className="text-3xl font-bold">Guitar Fretboard Visualizer</h1>
          <button
            onClick={() => setShowSettings(true)}
            className={`p-2 rounded-lg transition-colors ${themeClasses.button}`}
          >
            <SettingsIcon />
          </button>
        </div>

        {/* Mode Selection */}
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewModeChange("chord")}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              viewMode === "chord"
                ? "bg-blue-500 text-white"
                : `${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} hover:bg-opacity-80`
            }`}
          >
            Chord Mode
          </button>
          <button
            onClick={() => handleViewModeChange("scale")}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              viewMode === "scale"
                ? "bg-blue-500 text-white"
                : themeClasses.secondaryButton
            }`}
          >
            Scale Mode
          </button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Root Note Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${themeClasses.text}`}>
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
              <label className={`block text-sm font-medium mb-2 ${themeClasses.text}`}>
                Chord Type
              </label>
              <select
                value={selectedChord}
                onChange={(e) => setSelectedChord(e.target.value)}
                className={`w-full p-2 rounded border ${themeClasses.select}`}
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
              <label className={`block text-sm font-medium mb-2 ${themeClasses.text}`}>
                Scale Type
              </label>
              <select
                value={selectedScale}
                onChange={(e) => setSelectedScale(e.target.value)}
                className={`w-full p-2 rounded border ${themeClasses.select}`}
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
            <label className={`block text-sm font-medium mb-2 ${themeClasses.text}`}>
              Tuning
            </label>
            <select
              value={selectedTuning}
              onChange={(e) => setSelectedTuning(e.target.value)}
              className={`w-full p-2 rounded border ${themeClasses.select}`}
            >
              {Object.keys(MusicTheory.TUNINGS).map((tuning) => (
                <option key={tuning} value={tuning}>
                  {tuning}
                </option>
              ))}
              <option value="Custom">Custom</option>
            </select>
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
            <label className={`block text-sm font-medium mb-2 ${themeClasses.text}`}>
              Scale Chords
            </label>
            <div className="flex flex-wrap gap-2">
              {scaleChords.map((chord, index) => (
                <button
                  key={index}
                  onClick={() => handleScaleChordSelect(chord)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    selectedScaleChord === chord
                      ? "bg-blue-500 text-white"
                      : themeClasses.secondaryButton
                  }`}
                >
                  {chord.root} ({chord.degree})
                </button>
              ))}
            </div>
          </div>
        )}

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
                <label className={`text-sm ${themeClasses.text}`}>Strings:</label>
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

        {/* Fretboard */}
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

        {/* Hovered Note Info */}
        {hoveredNote && (
          <div className={`p-4 rounded border ${themeClasses.cardBg} ${themeClasses.border}`}>
            <p className={`text-sm ${themeClasses.text}`}>
              Hovered: {hoveredNote.noteName} (String {hoveredNote.string + 1}, Fret {hoveredNote.fret})
            </p>
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