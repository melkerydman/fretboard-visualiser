import React, { useRef, useMemo } from 'react';
import MusicTheory from '../../musicTheory.js';
import { FRET_MARKERS } from '../../constants/index.js';

const Fretboard = ({
  tuning = MusicTheory.STANDARD_TUNING,
  capo = null,
  highlightedNotes = [],
  selectedNotes = [],
  maxFrets = 12,
  onNoteClick = () => {},
  onNoteHover = () => {},
  onCapoMove = () => {},
  recommendedCapoPositions = [],
  settings = {
    verticalFretboard: false,
    darkMode: false,
    layoutSize: "comfortable",
    leftHanded: false,
  }
}) => {
  const stringCount = tuning.length;
  const isVertical = settings.verticalFretboard;
  const isCompact = settings.layoutSize === "compact";
  const isLeftHanded = settings.leftHanded;

  // Helper function to get visual string position
  const getVisualStringPosition = (logicalString) => {
    // Default (right-handed): Low E (0) -> High E (5)
    // Vertical: Low E on left, High E on right
    // Horizontal: Low E on top, High E on bottom
    
    // Left-handed flips the string order
    if (isLeftHanded) {
      return stringCount - 1 - logicalString;
    }
    return logicalString;
  };

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
    selectedNote: settings.darkMode ? "#F59E0B" : "#F59E0B",
    selectedStroke: settings.darkMode ? "#D97706" : "#D97706",
    selectedNoteAlt: settings.darkMode ? "#EF4444" : "#EF4444",
    selectedStrokeAlt: settings.darkMode ? "#DC2626" : "#DC2626",
    capoNote: settings.darkMode ? "#8B4513" : "#CD853F",
    capoStroke: settings.darkMode ? "#A0522D" : "#8B4513",
    greyedNote: settings.darkMode ? "#6B7280" : "#9CA3AF",
    greyedStroke: settings.darkMode ? "#4B5563" : "#6B7280",
    capo: settings.darkMode ? "#8B4513" : "#8B4513",
    text: settings.darkMode ? "#E5E7EB" : "#374151",
  };

  const isNoteGreyedOut = (fret, stringIndex) => {
    if (!capo || fret === 0) return false;

    // capo.fromTop means "from the thin strings" (high-numbered logical strings)
    // stringIndex is the logical string (0 = low E, 5 = high E)
    const isStringCovered = capo.fromTop
      ? stringIndex >= stringCount - capo.strings  // Cover highest-numbered strings
      : stringIndex < capo.strings;                 // Cover lowest-numbered strings
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
        const visualString = getVisualStringPosition(string);
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
        const visualString = getVisualStringPosition(string);
        const y = 50 + visualString * fretHeight;
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
      
      // Calculate which logical strings are covered (same logic as horizontal)
      const coveredStrings = [];
      if (capo.fromTop) {
        // Cover highest-numbered strings (thin strings)
        for (let i = stringCount - capo.strings; i < stringCount; i++) {
          coveredStrings.push(i);
        }
      } else {
        // Cover lowest-numbered strings (thick strings)
        for (let i = 0; i < capo.strings; i++) {
          coveredStrings.push(i);
        }
      }
      
      // Convert to visual positions and get bounds
      const visualStrings = coveredStrings.map(s => getVisualStringPosition(s));
      const minVisualString = Math.min(...visualStrings);
      const maxVisualString = Math.max(...visualStrings);
      
      const startX = 50 + minVisualString * fretWidth;
      const endX = 50 + maxVisualString * fretWidth;
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
      
      // Calculate which logical strings are covered
      const coveredStrings = [];
      if (capo.fromTop) {
        // Cover highest-numbered strings (thin strings)
        for (let i = stringCount - capo.strings; i < stringCount; i++) {
          coveredStrings.push(i);
        }
      } else {
        // Cover lowest-numbered strings (thick strings)
        for (let i = 0; i < capo.strings; i++) {
          coveredStrings.push(i);
        }
      }
      
      // Convert to visual positions and get bounds
      const visualStrings = coveredStrings.map(s => getVisualStringPosition(s));
      const minVisualString = Math.min(...visualStrings);
      const maxVisualString = Math.max(...visualStrings);
      
      const startY = 50 + minVisualString * fretHeight;
      const endY = 50 + maxVisualString * fretHeight;
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
      
      // Check if this specific position is selected
      const selectedPosition = selectedNotes.find(selPos => 
        selPos.string === pos.string && selPos.fret === pos.fret
      );
      const isSelected = !!selectedPosition;
      
      // Count how many times this note value appears in selectedNotes
      const noteOccurrences = selectedNotes.filter(selPos => selPos.note === pos.note);
      const occurrenceIndex = noteOccurrences.findIndex(selPos => 
        selPos.string === pos.string && selPos.fret === pos.fret
      );

      let x, y;
      if (isVertical) {
        const visualString = getVisualStringPosition(pos.string);
        x = 50 + visualString * fretWidth;
        y = 50 + (pos.fret === 0 ? -0.3 : pos.fret - 0.5) * fretHeight;
      } else {
        x = 50 + (pos.fret === 0 ? -0.3 : pos.fret - 0.5) * fretWidth;
        const visualString = getVisualStringPosition(pos.string);
        y = 50 + visualString * fretHeight;
      }

      const noteRadius = isCompact ? 8 : 12;

      // Determine note styling based on state
      let fillColor, strokeColor, opacity;
      if (isGreyed) {
        fillColor = theme.greyedNote;
        strokeColor = theme.greyedStroke;
        opacity = 0.5;
      } else if (isSelected) {
        // Check if this is a capo note
        if (selectedPosition && selectedPosition.isCapo) {
          fillColor = theme.capoNote;
          strokeColor = theme.capoStroke;
        } else {
          // Alternate colors for different manual selections of the same note
          if (occurrenceIndex % 2 === 0) {
            fillColor = theme.selectedNote; // Orange
            strokeColor = theme.selectedStroke;
          } else {
            fillColor = theme.selectedNoteAlt; // Red
            strokeColor = theme.selectedStrokeAlt;
          }
        }
        opacity = 1;
      } else {
        fillColor = theme.note;
        strokeColor = theme.noteStroke;
        opacity = 1;
      }

      return (
        <g key={`note-${index}`}>
          <circle
            cx={x}
            cy={y}
            r={noteRadius}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="2"
            opacity={opacity}
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
        const visualString = getVisualStringPosition(stringIndex);
        x = 50 + visualString * fretWidth;
        y = 20;
      } else {
        x = 20;
        const visualString = getVisualStringPosition(stringIndex);
        y = 50 + visualString * fretHeight;
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
        {renderCapo()}
        {renderNotes()}
        {renderTuningLabels()}
        {renderFretNumbers()}
      </svg>
    </div>
  );
};

export default Fretboard;