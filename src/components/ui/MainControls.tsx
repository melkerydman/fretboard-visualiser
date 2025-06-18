import MusicTheory from "../../services/musicTheory.js";
import InputField from "./InputField";
import CustomTuningSelector from "./CustomTuningSelector";
import { NoteName, ChordType, ScaleType } from "../../types/music";
import { TuningName } from "../../types/guitar";
import { useGuitar, useThemeContext } from "../../context";
import { useMusicTheory } from "../../hooks/music/index.js";

const MainControls = () => {
  // Get contexts (settings not needed as components use theme context directly)
  const { themeClasses } = useThemeContext();
  // Get guitar state and actions from context
  const {
    viewMode,
    selectedRoot,
    selectedChord,
    selectedScale,
    selectedTuning,
    customTuning,
    maxFrets,
    setSelectedRoot,
    setSelectedChord,
    setSelectedScale,
    setSelectedTuning,
    setCustomTuning,
    setMaxFrets,
  } = useGuitar();

  // Get music theory data from hook
  const { chordTypes, scaleTypes, availableNotes } = useMusicTheory();

  // Create options for selects
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
        onChange={(value) => setSelectedRoot(value as NoteName)}
        options={rootNoteOptions}
      />

      {viewMode === "chord" ? (
        <InputField
          type="select"
          label="Chord Type"
          value={selectedChord}
          onChange={(value) => setSelectedChord(value as ChordType)}
          options={chordTypeOptions}
          themeClasses={themeClasses}
        />
      ) : (
        <InputField
          type="select"
          label="Scale Type"
          value={selectedScale}
          onChange={(value) => setSelectedScale(value as ScaleType)}
          options={scaleTypeOptions}
          themeClasses={themeClasses}
        />
      )}

      <div>
        <InputField
          type="select"
          label="Tuning"
          value={selectedTuning}
          onChange={(value) => setSelectedTuning(value as TuningName)}
          options={tuningOptions}
          themeClasses={themeClasses}
        />
        {selectedTuning === "Custom" && (
          <div className="mt-4">
            <CustomTuningSelector
              tuning={customTuning}
              onChange={setCustomTuning}
            />
          </div>
        )}
      </div>

      <InputField
        type="number"
        label="Max Frets"
        value={maxFrets}
        onChange={(value) => setMaxFrets(Number(value))}
        themeClasses={themeClasses}
        min={12}
        max={24}
      />
    </div>
  );
};

export default MainControls;