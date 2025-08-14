import { useGuitar } from '../../context';

const ModeSelector = () => {
  const { viewMode, handleViewModeChange } = useGuitar();
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => handleViewModeChange("chord")}
        className={`px-4 py-2 rounded font-medium transition-colors border ${
          viewMode === "chord"
            ? "bg-[var(--color-primary)] text-[var(--color-text-inverse)] border-[var(--color-primary)]"
            : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)]"
        }`}
      >
        Chord Mode
      </button>
      <button
        onClick={() => handleViewModeChange("scale")}
        className={`px-4 py-2 rounded font-medium transition-colors border ${
          viewMode === "scale"
            ? "bg-[var(--color-primary)] text-[var(--color-text-inverse)] border-[var(--color-primary)]"
            : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)]"
        }`}
      >
        Scale Mode
      </button>
      <button
        onClick={() => handleViewModeChange("identifier")}
        className={`px-4 py-2 rounded font-medium transition-colors border ${
          viewMode === "identifier"
            ? "bg-[var(--color-primary)] text-[var(--color-text-inverse)] border-[var(--color-primary)]"
            : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)]"
        }`}
      >
        Identifier
      </button>
    </div>
  );
};

export default ModeSelector;