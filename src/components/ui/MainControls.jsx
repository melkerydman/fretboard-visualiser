import MusicTheory from "../../services/musicTheory.js";
import InputField from "./InputField.jsx";
import CustomTuningSelector from "./CustomTuningSelector.jsx";

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
}) => {
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
        onChange={onRootChange}
        options={rootNoteOptions}
        themeClasses={themeClasses}
      />

      {viewMode === "chord" ? (
        <InputField
          type="select"
          label="Chord Type"
          value={selectedChord}
          onChange={onChordChange}
          options={chordTypeOptions}
          themeClasses={themeClasses}
        />
      ) : (
        <InputField
          type="select"
          label="Scale Type"
          value={selectedScale}
          onChange={onScaleChange}
          options={scaleTypeOptions}
          themeClasses={themeClasses}
        />
      )}

      <div>
        <InputField
          type="select"
          label="Tuning"
          value={selectedTuning}
          onChange={onTuningChange}
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
        onChange={onMaxFretsChange}
        min={12}
        max={24}
        themeClasses={themeClasses}
      />
    </div>
  );
};

export default MainControls;