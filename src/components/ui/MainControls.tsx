import MusicTheory from "../../services/musicTheory.js";
import InputField from "./InputField";
import CustomTuningSelector from "./CustomTuningSelector";
import { ViewMode, ThemeClasses, UISettings } from "../../types/ui";
import { NoteName, ChordType, ScaleType } from "../../types/music";
import { Tuning, FretNumber } from "../../types/guitar";

type TuningName = keyof typeof MusicTheory.TUNINGS | "Custom";

interface MainControlsProps {
  viewMode: ViewMode;
  selectedRoot: NoteName;
  selectedChord: ChordType;
  selectedScale: ScaleType;
  selectedTuning: TuningName;
  customTuning: Tuning;
  maxFrets: FretNumber;
  availableNotes: NoteName[];
  chordTypes: ChordType[];
  scaleTypes: ScaleType[];
  settings: UISettings;
  themeClasses: Pick<ThemeClasses, 'text' | 'input'>;
  onRootChange: (root: NoteName) => void;
  onChordChange: (chord: ChordType) => void;
  onScaleChange: (scale: ScaleType) => void;
  onTuningChange: (tuning: TuningName) => void;
  onCustomTuningChange: (tuning: Tuning) => void;
  onMaxFretsChange: (frets: FretNumber) => void;
}

const MainControls = ({
  viewMode,
  selectedRoot,
  selectedChord,
  selectedScale,
  selectedTuning,
  customTuning,
  maxFrets,
  availableNotes,
  chordTypes,
  scaleTypes,
  settings,
  themeClasses,
  onRootChange,
  onChordChange,
  onScaleChange,
  onTuningChange,
  onCustomTuningChange,
  onMaxFretsChange,
}: MainControlsProps) => {
  const rootNoteOptions = availableNotes.map(note => ({ value: note, label: note }));
  const chordTypeOptions = chordTypes.map(chord => ({ value: chord, label: chord }));
  const scaleTypeOptions = scaleTypes.map(scale => ({ value: scale, label: scale }));
  const tuningOptions = [
    ...Object.keys(MusicTheory.TUNINGS).map(tuning => ({ value: tuning, label: tuning })),
    { value: "Custom", label: "Custom" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <InputField
        type="select"
        label="Root Note"
        value={selectedRoot}
        onChange={(value) => onRootChange(value as NoteName)}
        options={rootNoteOptions}
        themeClasses={themeClasses}
      />

      {viewMode === "chord" ? (
        <InputField
          type="select"
          label="Chord Type"
          value={selectedChord}
          onChange={(value) => onChordChange(value as ChordType)}
          options={chordTypeOptions}
          themeClasses={themeClasses}
        />
      ) : (
        <InputField
          type="select"
          label="Scale Type"
          value={selectedScale}
          onChange={(value) => onScaleChange(value as ScaleType)}
          options={scaleTypeOptions}
          themeClasses={themeClasses}
        />
      )}

      <div>
        <InputField
          type="select"
          label="Tuning"
          value={selectedTuning}
          onChange={(value) => onTuningChange(value as TuningName)}
          options={tuningOptions}
          themeClasses={themeClasses}
        />
        {selectedTuning === "Custom" && (
          <div className="mt-4">
            <CustomTuningSelector
              tuning={customTuning}
              onChange={onCustomTuningChange}
              settings={settings}
            />
          </div>
        )}
      </div>

      <InputField
        type="number"
        label="Max Frets"
        value={maxFrets}
        onChange={(value) => onMaxFretsChange(Number(value))}
        themeClasses={themeClasses}
        min={12}
        max={24}
      />
    </div>
  );
};

export default MainControls;