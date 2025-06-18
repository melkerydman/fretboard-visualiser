import { useGuitar, useMusicalContext, useTheme } from '../../context';

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
  const { themeClasses } = useTheme();

  if (viewMode !== "identifier") return null;

  return (
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
                  ? `Capo note: ${getNoteName(pos.note)} on String ${(pos.string || 0) + 1}, Fret ${pos.fret}`
                  : `Click to remove ${getNoteName(pos.note)} from String ${(pos.string || 0) + 1}, Fret ${pos.fret}`
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
                    (chord.confidence ?? 0) >= 80 ? "bg-green-500" : 
                    (chord.confidence ?? 0) >= 60 ? "bg-yellow-500" : "bg-red-500"
                  } text-white`}>
                    {chord.confidence ?? 0}%
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
  );
};

export default ChordIdentifier;