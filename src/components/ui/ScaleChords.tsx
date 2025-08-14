import { useMemo } from 'react';
import { useGuitar, useMusicalContext } from '@/context';
import MusicTheory from '@/services/musicTheory.js';
import { Chord, ScaleChordGroup, NoteName } from '@/types/music';

const ScaleChords = () => {
  const {
    viewMode,
    selectedRoot,
    selectedScale,
    selectedScaleChord,
    handleScaleChordSelect,
  } = useGuitar();

  const { getNoteName, formatNoteNames } = useMusicalContext();

  // Computed scale chords for scale view
  const scaleChords = useMemo((): ScaleChordGroup[] => {
    if (viewMode !== "scale") return [];

    const allChordsInScale: Chord[] = MusicTheory.getChordsInScale(selectedRoot, selectedScale);
    
    // Group chords by root note
    const groupedChords: Partial<Record<NoteName, ScaleChordGroup>> = {};
    const scaleNotes = MusicTheory.generateScale(selectedRoot, selectedScale);
    
    scaleNotes.forEach((note, index) => {
      const noteName = getNoteName(note) as NoteName;
      groupedChords[noteName] = {
        root: noteName,
        rootSemitone: note,
        degree: index + 1,
        chords: allChordsInScale.filter((chord: Chord) => chord.rootName === noteName)
      };
    });

    return Object.values(groupedChords);
  }, [viewMode, selectedRoot, selectedScale, getNoteName]);

  if (viewMode !== "scale" || scaleChords.length === 0) return null;

  return (
    <div>
      <label className="block text-sm font-medium mb-4 text-[var(--color-text)]">
        Chords in {selectedRoot} {selectedScale}
      </label>
      
      {/* Horizontal layout: chords horizontally, chord types vertically */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 sm:gap-3">
        {scaleChords.map((scaleChord: ScaleChordGroup) => (
          <div key={scaleChord.root} className="bg-[var(--color-surface)] border-[var(--color-border)] border rounded-lg p-2">
            <h4 className="font-medium text-[var(--color-text)] text-center mb-1 text-sm">
              {scaleChord.root}
            </h4>
            <div className="text-xs text-[var(--color-text-secondary)] text-center mb-2">
              ({scaleChord.degree})
            </div>
            <div className="space-y-1">
              {scaleChord.chords.map((chord: Chord, chordIndex: number) => (
                <button
                  key={`${scaleChord.root}-${chord.type}-${chordIndex}`}
                  onClick={() => handleScaleChordSelect(chord)}
                  className={`w-full px-1 py-1 rounded text-xs transition-colors border ${
                    selectedScaleChord === chord
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)]"
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
        <div className="mt-4 p-3 rounded-md border bg-[var(--color-surface)] border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <span className="font-medium text-[var(--color-text)]">
              Selected: {selectedScaleChord.name}
            </span>
            <button
              onClick={() => handleScaleChordSelect(null)}
              className="px-2 py-1 text-xs rounded transition-colors bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)]"
            >
              Clear
            </button>
          </div>
          <div className="text-xs mt-1 text-[var(--color-text-secondary)]">
            Notes: {formatNoteNames(selectedScaleChord.notes)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScaleChords;