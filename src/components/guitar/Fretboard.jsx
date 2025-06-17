import React, { useRef, useMemo } from 'react';
import MusicTheory from '../../musicTheory.js';
import { FRET_MARKERS } from '../../constants/index.js';

const Fretboard = ({
  tuning = MusicTheory.STANDARD_TUNING,
  capo = null,
  highlightedNotes = [],
  maxFrets = 12,
  onNoteClick = () => {},
  onNoteHover = () => {},
  onCapoMove = () => {},
  recommendedCapoPositions = [],
  settings = {
    verticalFretboard: false,
    darkMode: false,
    layoutSize: "comfortable",
  }
}) => {
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

export default Fretboard;