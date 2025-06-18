import { useMusicalContext } from "../../context/MusicalContext.jsx";
import MusicTheory from "../../services/musicTheory.js";
import { STRING_LABELS } from "../../constants/index.js";
import InputField from "./InputField.jsx";

const CustomTuningSelector = ({ tuning, onChange, settings }) => {
  const { getNoteName } = useMusicalContext();
  
  const noteOptions = MusicTheory.NOTES.map((_, noteIndex) => ({
    value: noteIndex,
    label: getNoteName(noteIndex)
  }));

  const themeClasses = {
    text: settings.darkMode ? "text-gray-200" : "text-gray-700",
    input: settings.darkMode
      ? "bg-gray-700 border-gray-600 text-white"
      : "bg-white border-gray-300 text-gray-900"
  };

  const handleStringChange = (stringIndex, value) => {
    const newTuning = [...tuning];
    newTuning[stringIndex] = parseInt(value);
    onChange(newTuning);
  };
  
  return (
    <div className="space-y-2">
      <label
        className={`block text-sm font-medium ${themeClasses.text}`}
      >
        Custom Tuning
      </label>
      <div className="grid grid-cols-6 gap-2">
        {tuning.map((semitone, index) => (
          <div key={index} className="text-center">
            <InputField
              type="select"
              value={semitone}
              onChange={(value) => handleStringChange(index, value)}
              options={noteOptions}
              themeClasses={{
                ...themeClasses,
                input: `${themeClasses.input} p-1 text-sm`
              }}
            />
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-500 grid grid-cols-6 gap-2">
        {STRING_LABELS.map((label, index) => (
          <span key={index} className="text-center">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CustomTuningSelector;