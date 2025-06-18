import { useGuitar, useThemeContext } from '../../context';

const ModeSelector = () => {
  const { viewMode, handleViewModeChange } = useGuitar();
  const { themeClasses } = useThemeContext();
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => handleViewModeChange("chord")}
        className={`px-4 py-2 rounded font-medium transition-colors border ${
          viewMode === "chord"
            ? "bg-blue-500 text-white border-blue-500"
            : `${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} hover:bg-opacity-80`
        }`}
      >
        Chord Mode
      </button>
      <button
        onClick={() => handleViewModeChange("scale")}
        className={`px-4 py-2 rounded font-medium transition-colors border ${
          viewMode === "scale"
            ? "bg-blue-500 text-white border-blue-500"
            : `${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} hover:bg-opacity-80`
        }`}
      >
        Scale Mode
      </button>
      <button
        onClick={() => handleViewModeChange("identifier")}
        className={`px-4 py-2 rounded font-medium transition-colors border ${
          viewMode === "identifier"
            ? "bg-blue-500 text-white border-blue-500"
            : `${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} hover:bg-opacity-80`
        }`}
      >
        Identifier
      </button>
    </div>
  );
};

export default ModeSelector;