import MusicTheory from "../../services/musicTheory.js";
import { STRING_LABELS } from "../../constants/index.js";
import InputField from "./InputField";
import { Tuning } from "../../types/guitar";
import { Semitone } from "../../types/music";
import { useMusicalContext } from "../../context";

interface CustomTuningSelectorProps {
  tuning: Tuning;
  onChange: (tuning: Tuning) => void;
}

const CustomTuningSelector = ({ tuning, onChange }: CustomTuningSelectorProps) => {
  const { getNoteName } = useMusicalContext();
  
  const noteOptions = MusicTheory.NOTES.map((_, noteIndex) => ({
    value: noteIndex,
    label: getNoteName(noteIndex)
  }));


  const handleStringChange = (stringIndex: number, value: string | number) => {
    const newTuning = [...tuning];
    newTuning[stringIndex] = Number(value) as Semitone;
    onChange(newTuning);
  };
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[var(--color-text)]">
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
            />
          </div>
        ))}
      </div>
      <div className="text-xs text-[var(--color-text-secondary)] grid grid-cols-6 gap-2">
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