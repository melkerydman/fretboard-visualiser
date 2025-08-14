import { useState } from "react";
import "@/app.css";
import {
  GuitarProvider,
  useGuitar,
  MusicalContextProvider,
  SettingsProvider,
  useSettings,
  ThemeProvider,
  useTheme,
} from "@/context";
import type { NotePosition, Capo, UISettings } from "@/types";
import { Fretboard } from "@/components/guitar";
import { SettingsModal } from "@/components/ui/modals";
import { SettingsIcon } from "@/components/ui/icons";
import Dashboard from "@/components/ui/Dashboard";

// Main App Content (uses context)
const AppContent = () => {
  const {
    // State
    viewMode,
    maxFrets,
    capo,
    // Computed values
    currentTuning,
    highlightedNotes,
    effectiveSelectedNotes,
    recommendedCapoPositions,
    // Actions
    setCapo,
    setHoveredNote,
    toggleNoteSelection,
  } = useGuitar();

  // UI State
  const [showSettings, setShowSettings] = useState(false);
  const { settings, updateSettings } = useSettings();
  const { themeClasses } = useTheme();

  // Event handlers
  const handleNoteClick = (noteData: NotePosition) => {
    if (viewMode === "identifier") {
      toggleNoteSelection(noteData);
    } else {
      console.log("Note clicked:", noteData);
    }
  };

  const handleNoteHover = (noteData: NotePosition) => {
    setHoveredNote(noteData);
  };

  const handleCapoMove = (newCapo: Capo) => {
    setCapo(newCapo);
  };

  const handleSettingsChange = (newSettings: UISettings) => {
    updateSettings(newSettings);
  };


  const isSpacious = settings.layoutSize === "spacious";
  const isVertical = settings.verticalFretboard;
  const useSideBySide = isSpacious && isVertical;

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${themeClasses.bg}`}
    >
      <div
        className={`container mx-auto p-4 ${useSideBySide ? "" : "space-y-6"}`}
      >
        {/* Header */}
        <div
          className={`flex justify-between items-center ${themeClasses.text} ${
            useSideBySide ? "mb-6" : ""
          }`}
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
              <Dashboard />
            </div>

            {/* Fretboard Column - only takes space it needs */}
            <div className="lg:flex-shrink-0 lg:flex lg:items-start lg:justify-center">
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
            </div>
          </div>
        ) : (
          /* Standard vertical layout */
          <div className="space-y-6">
            <Dashboard />
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
function App() {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <GuitarProvider>
          <MusicalContextProvider>
            <AppContent />
          </MusicalContextProvider>
        </GuitarProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
}

export default App;
