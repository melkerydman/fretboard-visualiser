import { useGuitar, useMusicalContext } from '../../context';

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

  return (
    <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-4 border border-[var(--color-border)]">
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span className="text-[var(--color-text)]">
          <strong>Current:</strong> {selectedRoot}{" "}
          {viewMode === "chord" ? selectedChord : selectedScale}
          {selectedScaleChord && ` → ${selectedScaleChord.name}`}
        </span>
        <span className="text-[var(--color-text)]">
          <strong>Tuning:</strong>{" "}
          {formatNoteNames(currentTuning, "-")}{" "}
          (Low to High)
        </span>
        <span className="text-[var(--color-text)]">
          <strong>Notes:</strong>{" "}
          {formatNoteNames(highlightedNotes)}
        </span>
        {capo && (
          <span className="text-[var(--color-text)]">
            <strong>Capo:</strong> Fret {capo.fret}, {capo.strings} strings
            from {capo.fromTop ? "top" : "bottom"}
          </span>
        )}
        {hoveredNote && (
          <span className="text-[var(--color-text-secondary)]">
            <strong>Hovered:</strong> {hoveredNote.noteName} (String{" "}
            {(hoveredNote.string || 0) + 1}, Fret {hoveredNote.fret})
          </span>
        )}
      </div>
    </div>
  );
};

export default StatusPanel;