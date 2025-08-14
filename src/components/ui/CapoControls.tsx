import { useGuitar } from '../../context';

const CapoControls = () => {
  const {
    capo,
    addCapo,
    removeCapo,
    updateCapoStrings,
    toggleCapoDirection,
  } = useGuitar();

  return (
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
            <label className="text-sm text-[var(--color-text)]">
              Strings:
            </label>
            <select
              value={capo.strings}
              onChange={(e) => updateCapoStrings(parseInt(e.target.value))}
              className="p-1 rounded border text-sm bg-[var(--color-input-bg)] border-[var(--color-input-border)] text-[var(--color-input-text)]"
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
            className="px-3 py-1 rounded text-sm transition-colors bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)]"
          >
            {capo.fromTop ? "From Top" : "From Bottom"}
          </button>
        </>
      )}
    </div>
  );
};

export default CapoControls;