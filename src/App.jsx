import React, { useState, useMemo, useRef, useEffect } from "react";
import "./app.css";
import MusicTheory from "./musicTheory.js";
import { LAYOUT_OPTIONS, THEME_OPTIONS, STRING_LABELS, FRET_MARKERS } from "./constants/index.js";
import { SettingsIcon, CloseIcon, LayoutIcon } from "./components/ui/icons/index.js";


// ==================== SETTINGS MODAL COMPONENT ====================

const SettingsModal = ({ isOpen, onClose, settings, onSettingsChange }) => {
  if (!isOpen) return null;

  const handleSettingChange = (key, value) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const layoutOptions = LAYOUT_OPTIONS;

  const themeOptions = THEME_OPTIONS;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`w-full max-w-lg rounded-lg shadow-xl ${
          settings.darkMode
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200"
        }`}
      >
        <div
          className={`flex items-center justify-between p-6 border-b ${
            settings.darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h3
            className={`text-lg font-medium ${
              settings.darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Settings
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded hover:bg-opacity-10 hover:bg-gray-500 ${
              settings.darkMode
                ? "text-gray-400 hover:text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Fretboard Orientation */}
          <div>
            <label
              className={`block text-sm font-medium mb-3 ${
                settings.darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Fretboard Orientation
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="orientation"
                  checked={!settings.verticalFretboard}
                  onChange={() =>
                    handleSettingChange("verticalFretboard", false)
                  }
                  className="mr-2 text-blue-600"
                />
                <span
                  className={
                    settings.darkMode ? "text-gray-300" : "text-gray-700"
                  }
                >
                  Horizontal (Traditional)
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="orientation"
                  checked={settings.verticalFretboard}
                  onChange={() =>
                    handleSettingChange("verticalFretboard", true)
                  }
                  className="mr-2 text-blue-600"
                />
                <span
                  className={
                    settings.darkMode ? "text-gray-300" : "text-gray-700"
                  }
                >
                  Vertical (Mobile-friendly)
                </span>
              </label>
            </div>
          </div>

          {/* Theme */}
          <div>
            <label
              className={`block text-sm font-medium mb-3 ${
                settings.darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSettingChange("theme", option.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    settings.theme === option.value
                      ? settings.darkMode
                        ? "border-blue-500 bg-blue-900/30"
                        : "border-blue-500 bg-blue-50"
                      : settings.darkMode
                      ? "border-gray-600 hover:border-gray-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`text-sm font-medium ${
                      settings.darkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {option.label}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      settings.darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {option.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Layout Size */}
          <div>
            <label
              className={`block text-sm font-medium mb-3 ${
                settings.darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Layout Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {layoutOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    handleSettingChange("layoutSize", option.value)
                  }
                  className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center ${
                    settings.layoutSize === option.value
                      ? settings.darkMode
                        ? "border-blue-500 bg-blue-900/30"
                        : "border-blue-500 bg-blue-50"
                      : settings.darkMode
                      ? "border-gray-600 hover:border-gray-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <LayoutIcon
                    type={option.value}
                    className={`w-6 h-6 mb-2 ${
                      settings.darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  />
                  <div
                    className={`text-sm font-medium ${
                      settings.darkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {option.label}
                  </div>
                  <div
                    className={`text-xs mt-1 text-center ${
                      settings.darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {option.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className={`px-6 py-4 border-t ${
            settings.darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <button
            onClick={onClose}
            className={`w-full px-4 py-2 rounded font-medium ${
              settings.darkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== FRETBOARD COMPONENT ====================

const GuitarFretboard = (props) => {
  const tuning = props.tuning || MusicTheory.STANDARD_TUNING;
  const capo = props.capo || null;
  const highlightedNotes = props.highlightedNotes || [];
  const maxFrets = props.maxFrets || 12;
  const onNoteClick = props.onNoteClick || (() => {});
  const onNoteHover = props.onNoteHover || (() => {});
  const onCapoMove = props.onCapoMove || (() => {});
  const recommendedCapoPositions = props.recommendedCapoPositions || [];
  const settings = props.settings || {
    verticalFretboard: false,
    darkMode: false,
    layoutSize: "comfortable",
  };

  const stringCount = tuning.length;
  const isVertical = settings.verticalFretboard;
  const isCompact = settings.layoutSize === "compact";

  const fretWidth = isVertical ? (isCompact ? 25 : 30) : isCompact ? 40 : 60;
  const fretHeight = isVertical ? (isCompact ? 40 : 60) : isCompact ? 20 : 30;

  const width = isVertical
    ? stringCount * fretWidth + 100
    : (maxFrets + 1) * fretWidth + 100;
  const height = isVertical
    ? (maxFrets + 1) * fretHeight + 100
    : stringCount * fretHeight + 60;

  const svgRef = useRef(null);

  const notePositions = useMemo(() => {
    if (highlightedNotes.length === 0) return [];
    return MusicTheory.findNotePositions(tuning, highlightedNotes, maxFrets);
  }, [tuning, highlightedNotes, maxFrets]);

  const theme = {
    fretboard: settings.darkMode ? "#2D1B1B" : "#F7E6A3",
    fret: settings.darkMode ? "#555" : "#ccc",
    nutFret: settings.darkMode ? "#777" : "#333",
    string: settings.darkMode ? "#888" : "#666",
    fretMarker: settings.darkMode ? "#666" : "#ddd",
    note: settings.darkMode ? "#3B82F6" : "#3B82F6",
    noteStroke: settings.darkMode ? "#1E40AF" : "#1E40AF",
    greyedNote: settings.darkMode ? "#6B7280" : "#9CA3AF",
    greyedStroke: settings.darkMode ? "#4B5563" : "#6B7280",
    capo: settings.darkMode ? "#8B4513" : "#8B4513",
    text: settings.darkMode ? "#E5E7EB" : "#374151",
  };

  const isNoteGreyedOut = (fret, stringIndex) => {
    if (!capo || fret === 0) return false;

    let visualStringIndex;
    if (isVertical) {
      visualStringIndex = stringCount - 1 - stringIndex;
    } else {
      visualStringIndex = stringIndex;
    }

    const isStringCovered = capo.fromTop
      ? visualStringIndex < capo.strings
      : visualStringIndex >= stringCount - capo.strings;
    return isStringCovered && fret < capo.fret;
  };

  const handleCapoDrag = (e) => {
    e.preventDefault();
    if (!svgRef.current || !capo) return;

    const rect = svgRef.current.getBoundingClientRect();
    let newFret;
    if (isVertical) {
      const y = e.clientY - rect.top;
      newFret = Math.max(
        1,
        Math.min(maxFrets, Math.round((y - 50) / fretHeight))
      );
    } else {
      const x = e.clientX - rect.left;
      newFret = Math.max(
        1,
        Math.min(maxFrets, Math.round((x - 50) / fretWidth))
      );
    }

    if (newFret !== capo.fret) {
      onCapoMove({ ...capo, fret: newFret });
    }
  };

  const handleCapoMouseDown = (e) => {
    e.preventDefault();
    const handleMouseMove = (e) => handleCapoDrag(e);
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const renderFretboard = () => {
    const elements = [];

    if (isVertical) {
      for (let fret = 0; fret <= maxFrets; fret++) {
        const y = 50 + fret * fretHeight;
        elements.push(
          <line
            key={`fret-${fret}`}
            x1={30}
            y1={y}
            x2={width - 30}
            y2={y}
            stroke={fret === 0 ? theme.nutFret : theme.fret}
            strokeWidth={fret === 0 ? "3" : "1"}
          />
        );
      }

      for (let string = 0; string < stringCount; string++) {
        const visualString = stringCount - 1 - string;
        const x = 50 + visualString * fretWidth;
        elements.push(
          <line
            key={`string-${string}`}
            x1={x}
            y1={50}
            x2={x}
            y2={height - 50}
            stroke={theme.string}
            strokeWidth="2"
          />
        );
      }
    } else {
      for (let fret = 0; fret <= maxFrets; fret++) {
        const x = 50 + fret * fretWidth;
        elements.push(
          <line
            key={`fret-${fret}`}
            x1={x}
            y1={30}
            x2={x}
            y2={height - 30}
            stroke={fret === 0 ? theme.nutFret : theme.fret}
            strokeWidth={fret === 0 ? "3" : "1"}
          />
        );
      }

      for (let string = 0; string < stringCount; string++) {
        const y = 50 + string * fretHeight;
        elements.push(
          <line
            key={`string-${string}`}
            x1={50}
            y1={y}
            x2={width - 50}
            y2={y}
            stroke={theme.string}
            strokeWidth="2"
          />
        );
      }
    }

    const fretMarkers = FRET_MARKERS;
    fretMarkers.forEach((fret) => {
      if (fret <= maxFrets) {
        if (isVertical) {
          const y = 50 + (fret - 0.5) * fretHeight;
          if (fret === 12 || fret === 24) {
            elements.push(
              <circle
                key={`marker-${fret}-1`}
                cx={width / 2 - 15}
                cy={y}
                r="4"
                fill={theme.fretMarker}
              />,
              <circle
                key={`marker-${fret}-2`}
                cx={width / 2 + 15}
                cy={y}
                r="4"
                fill={theme.fretMarker}
              />
            );
          } else {
            elements.push(
              <circle
                key={`marker-${fret}`}
                cx={width / 2}
                cy={y}
                r="4"
                fill={theme.fretMarker}
              />
            );
          }
        } else {
          const x = 50 + (fret - 0.5) * fretWidth;
          if (fret === 12 || fret === 24) {
            elements.push(
              <circle
                key={`marker-${fret}-1`}
                cx={x}
                cy={height / 2 - 15}
                r="4"
                fill={theme.fretMarker}
              />,
              <circle
                key={`marker-${fret}-2`}
                cx={x}
                cy={height / 2 + 15}
                r="4"
                fill={theme.fretMarker}
              />
            );
          } else {
            elements.push(
              <circle
                key={`marker-${fret}`}
                cx={x}
                cy={height / 2}
                r="4"
                fill={theme.fretMarker}
              />
            );
          }
        }
      }
    });

    return elements;
  };

  const renderRecommendedCapoIndicators = () => {
    return recommendedCapoPositions.slice(0, 3).map((rec, index) => {
      const opacity = 1 - index * 0.3;

      if (isVertical) {
        const y = 50 + (rec.fret - 0.5) * fretHeight;
        return (
          <g key={`rec-capo-${rec.fret}`}>
            <rect
              x={10}
              y={y - 15}
              width="30"
              height="15"
              fill="#10B981"
              opacity={opacity}
              rx="3"
            />
            <text
              x={25}
              y={y - 7.5}
              textAnchor="middle"
              dy="0.35em"
              className="text-xs font-bold text-white pointer-events-none"
            >
              {rec.matchingStrings}
            </text>
          </g>
        );
      } else {
        const x = 50 + (rec.fret - 0.5) * fretWidth;
        return (
          <g key={`rec-capo-${rec.fret}`}>
            <rect
              x={x - 15}
              y={10}
              width="30"
              height="15"
              fill="#10B981"
              opacity={opacity}
              rx="3"
            />
            <text
              x={x}
              y={17.5}
              textAnchor="middle"
              dy="0.35em"
              className="text-xs font-bold text-white pointer-events-none"
            >
              {rec.matchingStrings}
            </text>
          </g>
        );
      }
    });
  };

  const renderCapo = () => {
    if (!capo) return null;

    if (isVertical) {
      const y = 50 + (capo.fret - 0.5) * fretHeight;
      const startVisualString = capo.fromTop ? 0 : stringCount - capo.strings;
      const endVisualString = capo.fromTop ? capo.strings - 1 : stringCount - 1;

      const startX = 50 + startVisualString * fretWidth;
      const endX = 50 + endVisualString * fretWidth;
      const capoWidth = endX - startX + 20;

      return (
        <g className="cursor-move">
          <rect
            x={startX - 10}
            y={y - 12}
            width={capoWidth}
            height="24"
            fill={theme.capo}
            stroke="#654321"
            strokeWidth="2"
            rx="4"
            className="cursor-move"
            onMouseDown={handleCapoMouseDown}
          />
          <text
            x={startX + capoWidth / 2 - 10}
            y={y}
            textAnchor="middle"
            dy="0.35em"
            className="text-white text-xs font-bold pointer-events-none"
          >
            {capo.fret}
          </text>
        </g>
      );
    } else {
      const x = 50 + (capo.fret - 0.5) * fretWidth;
      const startString = capo.fromTop ? 0 : stringCount - capo.strings;
      const endString = capo.fromTop ? capo.strings - 1 : stringCount - 1;

      const startY = 50 + startString * fretHeight;
      const endY = 50 + endString * fretHeight;
      const capoHeight = endY - startY + 20;

      return (
        <g className="cursor-move">
          <rect
            x={x - 12}
            y={startY - 10}
            width="24"
            height={capoHeight}
            fill={theme.capo}
            stroke="#654321"
            strokeWidth="2"
            rx="4"
            className="cursor-move"
            onMouseDown={handleCapoMouseDown}
          />
          <text
            x={x}
            y={startY + capoHeight / 2 - 10}
            textAnchor="middle"
            dy="0.35em"
            className="text-white text-xs font-bold pointer-events-none"
          >
            {capo.fret}
          </text>
        </g>
      );
    }
  };

  const renderNotes = () => {
    return notePositions.map((pos, index) => {
      const isGreyed = isNoteGreyedOut(pos.fret, pos.string);

      let x, y;
      if (isVertical) {
        const visualString = stringCount - 1 - pos.string;
        x = 50 + visualString * fretWidth;
        y = 50 + (pos.fret === 0 ? -0.3 : pos.fret - 0.5) * fretHeight;
      } else {
        x = 50 + (pos.fret === 0 ? -0.3 : pos.fret - 0.5) * fretWidth;
        y = 50 + pos.string * fretHeight;
      }

      const noteRadius = isCompact ? 8 : 12;

      return (
        <g key={`note-${index}`}>
          <circle
            cx={x}
            cy={y}
            r={noteRadius}
            fill={isGreyed ? theme.greyedNote : theme.note}
            stroke={isGreyed ? theme.greyedStroke : theme.noteStroke}
            strokeWidth="2"
            opacity={isGreyed ? 0.5 : 1}
            className="cursor-pointer hover:fill-blue-400"
            onClick={() => onNoteClick(pos)}
            onMouseEnter={() => onNoteHover(pos)}
          />
          <text
            x={x}
            y={y}
            textAnchor="middle"
            dy="0.35em"
            className={`text-xs font-bold pointer-events-none ${
              isGreyed ? "text-gray-400" : "text-white"
            }`}
            opacity={isGreyed ? 0.7 : 1}
            fontSize={isCompact ? "10" : "12"}
          >
            {pos.noteName}
          </text>
        </g>
      );
    });
  };

  const renderTuningLabels = () => {
    return tuning.map((note, stringIndex) => {
      const noteName = MusicTheory.semitoneToNote(note);

      let x, y;
      if (isVertical) {
        const visualString = stringCount - 1 - stringIndex;
        x = 50 + visualString * fretWidth;
        y = 20;
      } else {
        x = 20;
        y = 50 + stringIndex * fretHeight;
      }

      return (
        <text
          key={`tuning-${stringIndex}`}
          x={x}
          y={y}
          textAnchor="middle"
          dy="0.35em"
          className="text-sm font-bold"
          fill={theme.text}
        >
          {noteName}
        </text>
      );
    });
  };

  const renderFretNumbers = () => {
    const numbers = [];
    for (let fret = 1; fret <= maxFrets; fret++) {
      let x, y;
      if (isVertical) {
        x = width - 20;
        y = 50 + (fret - 0.5) * fretHeight;
      } else {
        x = 50 + (fret - 0.5) * fretWidth;
        y = height - 10;
      }

      numbers.push(
        <text
          key={`fret-num-${fret}`}
          x={x}
          y={y}
          textAnchor="middle"
          className="text-xs"
          fill={theme.text}
          fontSize={isCompact ? "10" : "12"}
        >
          {fret}
        </text>
      );
    }
    return numbers;
  };

  return (
    <div className="w-full overflow-auto">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className={`border rounded-lg ${
          settings.darkMode ? "border-gray-600" : "border-gray-300"
        }`}
        style={{ backgroundColor: theme.fretboard }}
      >
        {renderFretboard()}
        {renderRecommendedCapoIndicators()}
        {renderNotes()}
        {renderCapo()}
        {renderTuningLabels()}
        {renderFretNumbers()}
      </svg>
    </div>
  );
};

// ==================== CUSTOM TUNING COMPONENT ====================

const CustomTuningSelector = ({ tuning, onChange, settings }) => {
  const stringLabels = STRING_LABELS;

  const themeClasses = {
    text: settings.darkMode ? "text-gray-200" : "text-gray-700",
    input: settings.darkMode
      ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500",
  };

  return (
    <div
      className={`grid ${
        settings.layoutSize === "compact"
          ? "grid-cols-1"
          : "grid-cols-2 lg:grid-cols-3"
      } gap-4`}
    >
      {tuning.map((note, index) => (
        <div key={index}>
          <label
            className={`block text-sm font-medium ${themeClasses.text} mb-1`}
          >
            {stringLabels[index]}
          </label>
          <select
            value={MusicTheory.semitoneToNote(note)}
            onChange={(e) => {
              const newTuning = [...tuning];
              newTuning[index] = MusicTheory.noteToSemitone(e.target.value);
              onChange(newTuning);
            }}
            className={`w-full p-2 border rounded-md ${themeClasses.input}`}
          >
            {MusicTheory.NOTES.map((noteName) => (
              <option key={noteName} value={noteName}>
                {noteName}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

// ==================== MAIN APP COMPONENT ====================

const GuitarVisualizerApp = () => {
  const [selectedRoot, setSelectedRoot] = useState("C");
  const [selectedChord, setSelectedChord] = useState("major");
  const [selectedScale, setSelectedScale] = useState("major");
  const [selectedTuning, setSelectedTuning] = useState("Standard");
  const [customTuning, setCustomTuning] = useState(MusicTheory.STANDARD_TUNING);
  const [capo, setCapo] = useState(null);
  const [viewMode, setViewMode] = useState("chord");
  const [maxFrets, setMaxFrets] = useState(12);
  const [hoveredNote, setHoveredNote] = useState(null);
  const [selectedScaleChord, setSelectedScaleChord] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    verticalFretboard: false,
    theme: "system",
    darkMode: false,
    layoutSize: "comfortable",
  });

  const [systemDarkMode, setSystemDarkMode] = useState(
    typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e) => setSystemDarkMode(e.matches);

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      }
    }
  }, []);

  useEffect(() => {
    let newDarkMode = false;

    switch (settings.theme) {
      case "dark":
        newDarkMode = true;
        break;
      case "light":
        newDarkMode = false;
        break;
      case "system":
      default:
        newDarkMode = systemDarkMode;
        break;
    }

    if (newDarkMode !== settings.darkMode) {
      setSettings((prev) => ({ ...prev, darkMode: newDarkMode }));
    }
  }, [settings.theme, systemDarkMode]);

  const currentTuning = useMemo(() => {
    if (selectedTuning === "Custom") {
      return customTuning;
    }
    return MusicTheory.TUNINGS[selectedTuning] || MusicTheory.TUNINGS.Standard;
  }, [selectedTuning, customTuning]);

  const highlightedNotes = useMemo(() => {
    if (viewMode === "chord") {
      return MusicTheory.generateChord(selectedRoot, selectedChord);
    } else if (selectedScaleChord) {
      return selectedScaleChord.notes;
    } else {
      return MusicTheory.generateScale(selectedRoot, selectedScale);
    }
  }, [
    viewMode,
    selectedRoot,
    selectedChord,
    selectedScale,
    selectedScaleChord,
  ]);

  const recommendedCapoPositions = useMemo(() => {
    return MusicTheory.findRecommendedCapoPositions(
      currentTuning,
      highlightedNotes,
      maxFrets
    );
  }, [currentTuning, highlightedNotes, maxFrets]);

  const addCapo = () => {
    setCapo({ fret: 3, strings: 6, fromTop: true });
  };

  const removeCapo = () => {
    setCapo(null);
  };

  const updateCapoStrings = (strings) => {
    if (capo) {
      setCapo({ ...capo, strings: parseInt(strings) });
    }
  };

  const toggleCapoDirection = () => {
    if (capo) {
      setCapo({ ...capo, fromTop: !capo.fromTop });
    }
  };

  const handleScaleChordSelect = (chord) => {
    setSelectedScaleChord(chord);
  };

  const handleViewModeChange = (newMode) => {
    setViewMode(newMode);
    if (newMode === "chord") {
      setSelectedScaleChord(null);
    }
  };

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
  };

  const themeClasses = {
    bg: settings.darkMode ? "bg-gray-900" : "bg-gray-50",
    cardBg: settings.darkMode ? "bg-gray-800" : "bg-white",
    border: settings.darkMode ? "border-gray-700" : "border-gray-300",
    text: settings.darkMode ? "text-white" : "text-gray-900",
    textSecondary: settings.darkMode ? "text-gray-300" : "text-gray-600",
    textTertiary: settings.darkMode ? "text-gray-400" : "text-gray-700",
    input: settings.darkMode
      ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500",
    button: settings.darkMode
      ? "bg-blue-600 hover:bg-blue-700 text-white"
      : "bg-blue-500 hover:bg-blue-600 text-white",
    buttonSecondary: settings.darkMode
      ? "bg-gray-700 hover:bg-gray-600 text-white"
      : "bg-gray-100 hover:bg-gray-200 text-gray-700",
  };

  return (
    <div
      className={`min-h-screen ${themeClasses.bg} transition-colors duration-200`}
    >
      <div
        className={`${
          settings.layoutSize === "compact" ? "px-2 py-4" : "p-6"
        } max-w-7xl mx-auto`}
      >
        <div className="flex items-center justify-between mb-6">
          <h1
            className={`${
              settings.layoutSize === "compact" ? "text-2xl" : "text-4xl"
            } font-bold ${themeClasses.text} text-center flex-1`}
          >
            Guitar Chord & Scale Visualizer
          </h1>
          <button
            onClick={() => setShowSettings(true)}
            className={`p-2 rounded-lg ${themeClasses.buttonSecondary} transition-colors`}
            title="Settings"
          >
            <SettingsIcon />
          </button>
        </div>

        <div
          className={
            settings.layoutSize === "spacious"
              ? "grid grid-cols-1 lg:grid-cols-2 gap-6"
              : "space-y-6"
          }
        >
          <div className="space-y-6">
            <div
              className={`${themeClasses.cardBg} rounded-lg shadow-lg p-4 ${themeClasses.border} border`}
            >
              <div
                className={`grid ${
                  settings.layoutSize === "compact"
                    ? "grid-cols-1"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                } gap-4`}
              >
                <div>
                  <label
                    className={`block text-sm font-medium ${themeClasses.textTertiary} mb-2`}
                  >
                    View Mode
                  </label>
                  <select
                    value={viewMode}
                    onChange={(e) => handleViewModeChange(e.target.value)}
                    className={`w-full p-2 border rounded-md ${themeClasses.input}`}
                  >
                    <option value="chord">Chord</option>
                    <option value="scale">Scale</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${themeClasses.textTertiary} mb-2`}
                  >
                    Root Note
                  </label>
                  <select
                    value={selectedRoot}
                    onChange={(e) => setSelectedRoot(e.target.value)}
                    className={`w-full p-2 border rounded-md ${themeClasses.input}`}
                  >
                    {MusicTheory.NOTES.map((note) => (
                      <option key={note} value={note}>
                        {note}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${themeClasses.textTertiary} mb-2`}
                  >
                    {viewMode === "chord" ? "Chord Type" : "Scale Type"}
                  </label>
                  <select
                    value={viewMode === "chord" ? selectedChord : selectedScale}
                    onChange={(e) =>
                      viewMode === "chord"
                        ? setSelectedChord(e.target.value)
                        : setSelectedScale(e.target.value)
                    }
                    className={`w-full p-2 border rounded-md ${themeClasses.input}`}
                  >
                    {Object.keys(
                      viewMode === "chord"
                        ? MusicTheory.CHORD_FORMULAS
                        : MusicTheory.SCALE_FORMULAS
                    ).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${themeClasses.textTertiary} mb-2`}
                  >
                    Tuning
                  </label>
                  <select
                    value={selectedTuning}
                    onChange={(e) => setSelectedTuning(e.target.value)}
                    className={`w-full p-2 border rounded-md ${themeClasses.input}`}
                  >
                    {Object.keys(MusicTheory.TUNINGS).map((tuning) => (
                      <option key={tuning} value={tuning}>
                        {tuning}
                      </option>
                    ))}
                    <option value="Custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${themeClasses.textTertiary} mb-2`}
                  >
                    Max Frets
                  </label>
                  <input
                    type="number"
                    min="12"
                    max="24"
                    value={maxFrets}
                    onChange={(e) =>
                      setMaxFrets(parseInt(e.target.value) || 12)
                    }
                    className={`w-full p-2 border rounded-md ${themeClasses.input}`}
                  />
                </div>
              </div>

              {selectedTuning === "Custom" && (
                <div className={`mt-6 pt-6 border-t ${themeClasses.border}`}>
                  <h3
                    className={`text-lg font-medium ${themeClasses.text} mb-4`}
                  >
                    Custom Tuning
                  </h3>
                  <CustomTuningSelector
                    tuning={customTuning}
                    onChange={setCustomTuning}
                    settings={settings}
                  />
                </div>
              )}

              <div className={`mt-6 pt-6 border-t ${themeClasses.border}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-medium ${themeClasses.text}`}>
                    Capo Settings
                  </h3>
                  <div className="flex gap-2">
                    {!capo ? (
                      <button
                        onClick={addCapo}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      >
                        Add Capo
                      </button>
                    ) : (
                      <button
                        onClick={removeCapo}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Remove Capo
                      </button>
                    )}
                  </div>
                </div>

                {capo && (
                  <div
                    className={`grid ${
                      settings.layoutSize === "compact"
                        ? "grid-cols-1"
                        : "grid-cols-1 md:grid-cols-3"
                    } gap-4`}
                  >
                    <div>
                      <label
                        className={`block text-sm font-medium ${themeClasses.textTertiary} mb-1`}
                      >
                        Strings Covered
                      </label>
                      <select
                        value={capo.strings}
                        onChange={(e) => updateCapoStrings(e.target.value)}
                        className={`w-full p-2 border rounded-md ${themeClasses.input}`}
                      >
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num}>
                            {num} strings
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium ${themeClasses.textTertiary} mb-1`}
                      >
                        Direction
                      </label>
                      <button
                        onClick={toggleCapoDirection}
                        className={`w-full p-2 border rounded-md ${themeClasses.buttonSecondary} transition-colors`}
                      >
                        From {capo.fromTop ? "High E" : "Low E"}
                      </button>
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium ${themeClasses.textTertiary} mb-1`}
                      >
                        Current Fret
                      </label>
                      <div
                        className={`p-2 ${
                          settings.darkMode ? "bg-gray-700" : "bg-gray-100"
                        } rounded-md text-center font-medium ${
                          themeClasses.text
                        }`}
                      >
                        Fret {capo.fret}
                      </div>
                    </div>
                  </div>
                )}

                {capo && (
                  <div
                    className={`mt-4 p-3 ${
                      settings.darkMode ? "bg-blue-900/50" : "bg-blue-50"
                    } rounded-md`}
                  >
                    <p
                      className={`text-sm ${
                        settings.darkMode ? "text-blue-200" : "text-blue-800"
                      }`}
                    >
                      <strong>Tip:</strong> Drag the capo on the fretboard to
                      move it to different frets. Green indicators show
                      recommended capo positions with the number of matching
                      strings.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {viewMode === "scale" && (
              <div
                className={`${themeClasses.cardBg} rounded-lg shadow-lg p-4 ${themeClasses.border} border`}
              >
                <h3 className={`text-lg font-medium ${themeClasses.text} mb-4`}>
                  Chords in {selectedRoot} {selectedScale}
                </h3>
                {(() => {
                  try {
                    const chords = MusicTheory.getChordsInScale(
                      selectedRoot,
                      selectedScale
                    );
                    const chordsByRoot = chords.reduce((acc, chord) => {
                      if (!acc[chord.rootName]) {
                        acc[chord.rootName] = [];
                      }
                      acc[chord.rootName].push(chord);
                      return acc;
                    }, {});

                    return (
                      <div className="space-y-3">
                        {Object.entries(chordsByRoot).map(
                          ([rootName, chords]) => (
                            <div key={rootName}>
                              <h4
                                className={`text-sm font-medium ${themeClasses.textTertiary} mb-2`}
                              >
                                {rootName}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {chords.map((chord, index) => {
                                  const isSelected =
                                    selectedScaleChord &&
                                    selectedScaleChord.root === chord.root &&
                                    selectedScaleChord.type === chord.type;

                                  return (
                                    <button
                                      key={`${chord.root}-${chord.type}-${index}`}
                                      onClick={() =>
                                        handleScaleChordSelect(chord)
                                      }
                                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                        isSelected
                                          ? themeClasses.button
                                          : themeClasses.buttonSecondary
                                      }`}
                                    >
                                      {chord.type}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    );
                  } catch (error) {
                    return (
                      <div className="text-red-500">
                        Error rendering chords: {error.message}
                      </div>
                    );
                  }
                })()}

                {selectedScaleChord && (
                  <div
                    className={`mt-4 p-3 ${
                      settings.darkMode ? "bg-blue-900/50" : "bg-blue-50"
                    } rounded-md`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-medium ${
                          settings.darkMode ? "text-blue-200" : "text-blue-900"
                        }`}
                      >
                        Selected: {selectedScaleChord.name}
                      </span>
                      <button
                        onClick={() => handleScaleChordSelect(null)}
                        className={`text-xs ${
                          settings.darkMode
                            ? "text-blue-300 hover:text-blue-100"
                            : "text-blue-600 hover:text-blue-800"
                        }`}
                      >
                        Clear
                      </button>
                    </div>
                    <div
                      className={`text-xs ${
                        settings.darkMode ? "text-blue-300" : "text-blue-700"
                      } mt-1`}
                    >
                      Notes:{" "}
                      {selectedScaleChord.notes
                        .map((note) => MusicTheory.semitoneToNote(note))
                        .join(" ")}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div
              className={`${themeClasses.cardBg} rounded-lg shadow-lg p-4 ${themeClasses.border} border`}
            >
              <div
                className={`flex flex-wrap items-center gap-4 text-sm ${themeClasses.textSecondary}`}
              >
                <span>
                  <strong>Current:</strong>{" "}
                  {selectedScaleChord
                    ? selectedScaleChord.name
                    : `${selectedRoot} ${
                        viewMode === "chord" ? selectedChord : selectedScale
                      }`}
                </span>
                <span>
                  <strong>Tuning:</strong>{" "}
                  {currentTuning
                    .map((note) => MusicTheory.semitoneToNote(note))
                    .join("-")}
                  <span className="text-xs ml-1">(Low to High)</span>
                </span>
                <span>
                  <strong>Notes:</strong>{" "}
                  {highlightedNotes
                    .map((note) => MusicTheory.semitoneToNote(note))
                    .join(" ")}
                </span>
                {capo && (
                  <span>
                    <strong>Capo:</strong> Fret {capo.fret}, {capo.strings}{" "}
                    strings from {capo.fromTop ? "High E" : "Low E"}
                  </span>
                )}
                {hoveredNote && (
                  <span>
                    <strong>Hovered:</strong> {hoveredNote.noteName} (String{" "}
                    {hoveredNote.string + 1}, Fret {hoveredNote.fret})
                  </span>
                )}
              </div>
            </div>
          </div>

          <div
            className={`${themeClasses.cardBg} rounded-lg shadow-lg p-4 ${themeClasses.border} border`}
          >
            <GuitarFretboard
              tuning={currentTuning}
              capo={capo}
              highlightedNotes={highlightedNotes}
              maxFrets={maxFrets}
              recommendedCapoPositions={recommendedCapoPositions}
              onNoteClick={(note) => console.log("Clicked note:", note)}
              onNoteHover={(note) => setHoveredNote(note)}
              onCapoMove={(newCapo) => setCapo(newCapo)}
              settings={settings}
            />
          </div>
        </div>

        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          settings={settings}
          onSettingsChange={handleSettingsChange}
        />
      </div>
    </div>
  );
};

export default GuitarVisualizerApp;
