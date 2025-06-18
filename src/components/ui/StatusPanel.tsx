import { useGuitar, useMusicalContext, useTheme } from '../../context';

const StatusPanel = () => {
  const {
    viewMode,
    selectedRoot,
    selectedChord,
    selectedScale,
    selectedScaleChord,
    currentTuning,
    highlightedNotes,
    capo,
    hoveredNote,
  } = useGuitar();

  const { formatNoteNames } = useMusicalContext();
  const { themeClasses } = useTheme();

  return (
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
            {(hoveredNote.string || 0) + 1}, Fret {hoveredNote.fret})
          </span>
        )}
      </div>
    </div>
  );
};

export default StatusPanel;