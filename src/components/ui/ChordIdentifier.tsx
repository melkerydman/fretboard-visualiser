import { useGuitar, useMusicalContext } from '../../context';

const ChordIdentifier = () => {
  const {
    viewMode,
    capo,
    identifiedChords,
    showAllNotes,
    includeCapoNotes,
    effectiveSelectedNotes,
    clearSelectedNotes,
    toggleShowAllNotes,
    removeSelectedNote,
    toggleIncludeCapoNotes,
  } = useGuitar();

  const { getNoteName, formatNoteNames } = useMusicalContext();

  if (viewMode !== "identifier") return null;

  return (
    <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-4 border border-[var(--color-border)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-[var(--color-text)]">
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
            <span className="text-sm text-[var(--color-text)]">
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
              <span className="text-sm text-[var(--color-text)]">
                Include capo notes
              </span>
            </label>
          )}
          <button
            onClick={clearSelectedNotes}
            className="px-3 py-1 rounded text-sm transition-colors bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)]"
          >
            Clear Notes
          </button>
        </div>
      </div>
      
      {/* Selected Notes Display */}
      <div className="mb-4">
        <div className="text-sm font-medium mb-2 text-[var(--color-text)]">
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
                  ? `Capo note: ${getNoteName(pos.note)} on String ${(pos.string || 0) + 1}, Fret ${pos.fret}`
                  : `Click to remove ${getNoteName(pos.note)} from String ${(pos.string || 0) + 1}, Fret ${pos.fret}`
                }
              >
                {getNoteName(pos.note)}{pos.isCapo ? ' 🎸' : ' ×'}
              </button>
            ))
          ) : (
            <span className="text-sm text-[var(--color-text-secondary)]">
              Click notes on the fretboard to identify chords
            </span>
          )}
        </div>
      </div>
      
      {/* Identified Chords */}
      {identifiedChords.length > 0 && (
        <div>
          <div className="text-sm font-medium mb-3 text-[var(--color-text)]">
            Possible Chords:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {identifiedChords.map((chord, index) => (
              <div
                key={index}
                className="p-3 rounded border bg-[var(--color-surface)] border-[var(--color-border)]"
              >
                <div className="font-medium text-[var(--color-text)] flex items-center justify-between">
                  <span>{chord.name}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    (chord.confidence ?? 0) >= 80 ? "bg-green-500" : 
                    (chord.confidence ?? 0) >= 60 ? "bg-yellow-500" : "bg-red-500"
                  } text-white`}>
                    {chord.confidence ?? 0}%
                  </span>
                </div>
                <div className="text-xs mt-1 text-[var(--color-text-secondary)]">
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
  );
};

export default ChordIdentifier;