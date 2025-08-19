import { useState } from "react";
import "@/App.css";
import {
  GuitarProvider,
  useGuitar,
  MusicalContextProvider,
  SettingsProvider,
  useSettings,
  ThemeProvider,
} from "@/context";
import type { NotePosition, Capo, UISettings } from "@/types";
import { Guitar } from "@/components/guitar";
import { SettingsModal } from "@/components/ui/modals";
import { Header } from "@/components/layout";
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
    <div className="min-h-screen transition-colors duration-200 bg-[var(--color-background)]">
      <div className="container mx-auto p-4">
        <Header onSettingsClick={() => setShowSettings(true)} />

        {useSideBySide ? (
          /* Side-by-side layout for spacious + vertical (only on lg+ screens) */
          <div className="lg:flex lg:gap-8 lg:h-full space-y-6 lg:space-y-0">
            {/* Dashboard Column - takes available space */}
            <div className="lg:flex-1 space-y-6 lg:overflow-y-auto lg:max-h-screen lg:min-w-0">
              <Dashboard />
            </div>

            {/* Fretboard Column - only takes space it needs */}
            <div className="lg:flex-shrink-0 lg:flex lg:items-start lg:justify-center">
              <Guitar
                tuning={currentTuning}
                capo={capo}
                highlightedNotes={highlightedNotes}
                selectedNotes={effectiveSelectedNotes}
                maxFrets={maxFrets}
                onNoteClick={handleNoteClick}
                onNoteHover={handleNoteHover}
                onCapoMove={handleCapoMove}
                recommendedCapoPositions={recommendedCapoPositions}
              />
            </div>
          </div>
        ) : (
          /* Standard vertical layout */
          <div className="space-y-6">
            <Dashboard />
            <Guitar
              tuning={currentTuning}
              capo={capo}
              highlightedNotes={highlightedNotes}
              selectedNotes={effectiveSelectedNotes}
              maxFrets={maxFrets}
              onNoteClick={handleNoteClick}
              onNoteHover={handleNoteHover}
              onCapoMove={handleCapoMove}
              recommendedCapoPositions={recommendedCapoPositions}
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
