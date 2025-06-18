import React, { useRef, useMemo } from 'react';
import MusicTheory from '../../musicTheory.js';
import { FRET_MARKERS } from '../../constants/index.js';
import { useMusicalContext } from '../../context/MusicalContext.jsx';

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

  // Get musical context for smart note naming
  const { musicalContext, getNoteName } = useMusicalContext();

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

  // Helper function to get realistic string width (based on Martin D-28)
  const getStringWidth = (logicalString) => {
    // Martin D-28 string gauges: .012, .016, .025w, .032w, .042w, .054w
    // Scale these to reasonable pixel widths for visual representation
    const stringWidths = [
      4.5, // Low E (.054w) - wound, thickest
      3.8, // A (.042w) - wound
      3.2, // D (.032w) - wound
      2.2, // G (.025w) - wound, but thinner
      1.8, // B (.016) - plain steel
      1.5  // High E (.012) - plain steel, thinnest
    ];
    return stringWidths[logicalString] || 2;
  };

  // Helper function to get realistic string color (Martin D-28 style)
  const getStringColor = (logicalString) => {
    // Low E, A, D, G strings are wound (bronze/phosphor bronze)
    // B and high E are plain steel
    if (logicalString <= 3) {
      // Wound strings - bronze/copper color
      return settings.darkMode ? "#CD7F32" : "#B8860B";
    } else {
      // Plain steel strings - bright metallic
      return settings.darkMode ? "#C0C0C0" : "#A8A8A8";
    }
  };

  const fretWidth = isVertical ? (isCompact ? 25 : 30) : isCompact ? 40 : 60;
  const fretHeight = isVertical ? (isCompact ? 40 : 60) : isCompact ? 20 : 30;

  // Define neck boundaries - the actual playable area
  const neckMargin = 30;
  const headstockLength = isVertical ? 60 : 40;
  const fretNumberSpace = 25;
  
  // Calculate neck dimensions
  const neckWidth = isVertical 
    ? stringCount * fretWidth
    : (maxFrets + 1) * fretWidth;
  const neckHeight = isVertical
    ? (maxFrets + 1) * fretHeight 
    : stringCount * fretHeight;

  // Total SVG dimensions including margins and labels
  const width = isVertical
    ? neckWidth + (neckMargin * 2) + fretNumberSpace
    : neckWidth + (neckMargin * 2) + headstockLength;
  const height = isVertical
    ? neckHeight + (neckMargin * 2) + headstockLength
    : neckHeight + (neckMargin * 2) + fretNumberSpace;

  // Neck positioning within SVG
  const neckStartX = isVertical ? neckMargin : neckMargin + headstockLength;
  const neckStartY = isVertical ? neckMargin + headstockLength : neckMargin;
  const neckEndX = neckStartX + neckWidth;
  const neckEndY = neckStartY + neckHeight;

  const svgRef = useRef(null);

  const notePositions = useMemo(() => {
    if (highlightedNotes.length === 0) return [];
    return MusicTheory.findNotePositions(tuning, highlightedNotes, maxFrets, musicalContext);
  }, [tuning, highlightedNotes, maxFrets, musicalContext]);

  const theme = {
    fretboard: settings.darkMode ? "#3A2818" : "#D4A574", // East Indian Rosewood fretboard color
    fret: settings.darkMode ? "#C0C0C0" : "#E0E0E0", // Nickel-silver frets
    nutFret: settings.darkMode ? "#F5F5DC" : "#F8F8FF", // Bone nut color
    string: settings.darkMode ? "#888" : "#666", // Will be overridden by getStringColor
    fretMarker: settings.darkMode ? "#F0F8FF" : "#FFF8DC", // Mother of pearl inlay dots
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
        Math.min(maxFrets, Math.round((y - neckStartY) / fretHeight))
      );
    } else {
      const x = e.clientX - rect.left;
      newFret = Math.max(
        1,
        Math.min(maxFrets, Math.round((x - neckStartX) / fretWidth))
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

    // Add neck background with subtle wood grain
    elements.push(
      <g key="neck-background">
        <rect
          x={neckStartX}
          y={neckStartY}
          width={neckWidth}
          height={neckHeight}
          fill={theme.fretboard}
          stroke={settings.darkMode ? "#2A1810" : "#8B4513"}
          strokeWidth="2"
          rx="4"
          filter="url(#shadow)"
        />
        <rect
          x={neckStartX}
          y={neckStartY}
          width={neckWidth}
          height={neckHeight}
          fill="url(#woodGrain)"
          opacity="0.3"
          rx="4"
        />
      </g>
    );

    if (isVertical) {
      // Render frets within neck bounds
      for (let fret = 0; fret <= maxFrets; fret++) {
        const y = neckStartY + fret * fretHeight;
        elements.push(
          <line
            key={`fret-${fret}`}
            x1={neckStartX}
            y1={y}
            x2={neckStartX + neckWidth}
            y2={y}
            stroke={fret === 0 ? theme.nutFret : theme.fret}
            strokeWidth={fret === 0 ? "4" : "2"}
          />
        );
      }

      // Render strings within neck bounds
      for (let string = 0; string < stringCount; string++) {
        const visualString = getVisualStringPosition(string);
        const x = neckStartX + (visualString + 0.5) * fretWidth;
        const stringWidth = getStringWidth(string);
        const stringColor = getStringColor(string);
        elements.push(
          <line
            key={`string-${string}`}
            x1={x}
            y1={neckStartY}
            x2={x}
            y2={neckStartY + neckHeight}
            stroke={stringColor}
            strokeWidth={stringWidth}
          />
        );
      }
    } else {
      // Render frets within neck bounds
      for (let fret = 0; fret <= maxFrets; fret++) {
        const x = neckStartX + fret * fretWidth;
        elements.push(
          <line
            key={`fret-${fret}`}
            x1={x}
            y1={neckStartY}
            x2={x}
            y2={neckStartY + neckHeight}
            stroke={fret === 0 ? theme.nutFret : theme.fret}
            strokeWidth={fret === 0 ? "3" : "1"}
          />
        );
      }

      // Render strings within neck bounds
      for (let string = 0; string < stringCount; string++) {
        const visualString = getVisualStringPosition(string);
        const y = neckStartY + (visualString + 0.5) * fretHeight;
        const stringWidth = getStringWidth(string);
        const stringColor = getStringColor(string);
        elements.push(
          <line
            key={`string-${string}`}
            x1={neckStartX}
            y1={y}
            x2={neckStartX + neckWidth}
            y2={y}
            stroke={stringColor}
            strokeWidth={stringWidth}
          />
        );
      }
    }

    const fretMarkers = FRET_MARKERS;
    fretMarkers.forEach((fret) => {
      if (fret <= maxFrets) {
        if (isVertical) {
          const y = neckStartY + (fret - 0.5) * fretHeight;
          const markerRadius = isCompact ? 5 : 7;
          const neckCenterX = neckStartX + neckWidth / 2;
          if (fret === 12 || fret === 24) {
            // Double dots for octave markers
            elements.push(
              <g key={`marker-${fret}`}>
                <circle
                  cx={neckCenterX - 18}
                  cy={y}
                  r={markerRadius}
                  fill="url(#pearlGradient)"
                  stroke={settings.darkMode ? "#C0C0C0" : "#D0D0D0"}
                  strokeWidth="0.5"
                />
                <circle
                  cx={neckCenterX + 18}
                  cy={y}
                  r={markerRadius}
                  fill="url(#pearlGradient)"
                  stroke={settings.darkMode ? "#C0C0C0" : "#D0D0D0"}
                  strokeWidth="0.5"
                />
              </g>
            );
          } else {
            // Single dot for other position markers
            elements.push(
              <circle
                key={`marker-${fret}`}
                cx={neckCenterX}
                cy={y}
                r={markerRadius}
                fill="url(#pearlGradient)"
                stroke={settings.darkMode ? "#C0C0C0" : "#D0D0D0"}
                strokeWidth="0.5"
              />
            );
          }
        } else {
          const x = neckStartX + (fret - 0.5) * fretWidth;
          const markerRadius = isCompact ? 5 : 7;
          const neckCenterY = neckStartY + neckHeight / 2;
          if (fret === 12 || fret === 24) {
            // Double dots for octave markers
            elements.push(
              <g key={`marker-${fret}`}>
                <circle
                  cx={x}
                  cy={neckCenterY - 18}
                  r={markerRadius}
                  fill="url(#pearlGradient)"
                  stroke={settings.darkMode ? "#C0C0C0" : "#D0D0D0"}
                  strokeWidth="0.5"
                />
                <circle
                  cx={x}
                  cy={neckCenterY + 18}
                  r={markerRadius}
                  fill="url(#pearlGradient)"
                  stroke={settings.darkMode ? "#C0C0C0" : "#D0D0D0"}
                  strokeWidth="0.5"
                />
              </g>
            );
          } else {
            // Single dot for other position markers
            elements.push(
              <circle
                key={`marker-${fret}`}
                cx={x}
                cy={neckCenterY}
                r={markerRadius}
                fill="url(#pearlGradient)"
                stroke={settings.darkMode ? "#C0C0C0" : "#D0D0D0"}
                strokeWidth="0.5"
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
        const y = neckStartY + (rec.fret - 0.5) * fretHeight;
        return (
          <g key={`rec-capo-${rec.fret}`}>
            <rect
              x={neckMargin - 25}
              y={y - 7.5}
              width="20"
              height="15"
              fill="#10B981"
              opacity={opacity}
              rx="3"
            />
            <text
              x={neckMargin - 15}
              y={y}
              textAnchor="middle"
              dy="0.35em"
              className="text-xs font-bold text-white pointer-events-none"
            >
              {rec.matchingStrings}
            </text>
          </g>
        );
      } else {
        const x = neckStartX + (rec.fret - 0.5) * fretWidth;
        return (
          <g key={`rec-capo-${rec.fret}`}>
            <rect
              x={x - 10}
              y={neckMargin - 25}
              width="20"
              height="15"
              fill="#10B981"
              opacity={opacity}
              rx="3"
            />
            <text
              x={x}
              y={neckMargin - 17.5}
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

  const renderHeadstock = () => {
    const elements = [];
    
    if (isVertical) {
      // Vertical headstock at top
      const headstockY = neckStartY - headstockLength;
      const headstockHeight = headstockLength;
      const headstockWidth = neckWidth * 0.8; // Slightly narrower than neck
      const headstockX = neckStartX + (neckWidth - headstockWidth) / 2;
      
      elements.push(
        <rect
          key="headstock"
          x={headstockX}
          y={headstockY}
          width={headstockWidth}
          height={headstockHeight}
          fill={settings.darkMode ? "#2A1810" : "#8B4513"}
          stroke={settings.darkMode ? "#1A100A" : "#654321"}
          strokeWidth="2"
          rx="6"
        />
      );
      
      // Tuning pegs
      for (let string = 0; string < stringCount; string++) {
        const visualString = getVisualStringPosition(string);
        const pegX = headstockX + (visualString + 0.5) * (headstockWidth / stringCount);
        const pegY = headstockY + headstockHeight * 0.7;
        
        elements.push(
          <circle
            key={`peg-${string}`}
            cx={pegX}
            cy={pegY}
            r="4"
            fill={settings.darkMode ? "#C0C0C0" : "#E0E0E0"}
            stroke={settings.darkMode ? "#A0A0A0" : "#C0C0C0"}
            strokeWidth="1"
          />
        );
      }
    } else {
      // Horizontal headstock at left
      const headstockX = neckStartX - headstockLength;
      const headstockWidth = headstockLength;
      const headstockHeight = neckHeight * 0.8; // Slightly narrower than neck
      const headstockY = neckStartY + (neckHeight - headstockHeight) / 2;
      
      elements.push(
        <rect
          key="headstock"
          x={headstockX}
          y={headstockY}
          width={headstockWidth}
          height={headstockHeight}
          fill={settings.darkMode ? "#2A1810" : "#8B4513"}
          stroke={settings.darkMode ? "#1A100A" : "#654321"}
          strokeWidth="2"
          rx="6"
        />
      );
      
      // Tuning pegs
      for (let string = 0; string < stringCount; string++) {
        const visualString = getVisualStringPosition(string);
        const pegY = headstockY + (visualString + 0.5) * (headstockHeight / stringCount);
        const pegX = headstockX + headstockWidth * 0.7;
        
        elements.push(
          <circle
            key={`peg-${string}`}
            cx={pegX}
            cy={pegY}
            r="4"
            fill={settings.darkMode ? "#C0C0C0" : "#E0E0E0"}
            stroke={settings.darkMode ? "#A0A0A0" : "#C0C0C0"}
            strokeWidth="1"
          />
        );
      }
    }
    
    return elements;
  };

  const renderCapo = () => {
    if (!capo) return null;

    if (isVertical) {
      const y = neckStartY + (capo.fret - 0.5) * fretHeight;
      
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
      
      const startX = neckStartX + (minVisualString + 0.5) * fretWidth;
      const endX = neckStartX + (maxVisualString + 0.5) * fretWidth;
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
      const x = neckStartX + (capo.fret - 0.5) * fretWidth;
      
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
      
      const startY = neckStartY + (minVisualString + 0.5) * fretHeight;
      const endY = neckStartY + (maxVisualString + 0.5) * fretHeight;
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
        x = neckStartX + (visualString + 0.5) * fretWidth;
        y = neckStartY + (pos.fret === 0 ? -0.3 : pos.fret - 0.5) * fretHeight;
      } else {
        x = neckStartX + (pos.fret === 0 ? -0.3 : pos.fret - 0.5) * fretWidth;
        const visualString = getVisualStringPosition(pos.string);
        y = neckStartY + (visualString + 0.5) * fretHeight;
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
      const noteName = getNoteName(note);

      let x, y;
      if (isVertical) {
        const visualString = getVisualStringPosition(stringIndex);
        x = neckStartX + (visualString + 0.5) * fretWidth;
        y = 20;
      } else {
        x = 20;
        const visualString = getVisualStringPosition(stringIndex);
        y = neckStartY + (visualString + 0.5) * fretHeight;
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
        x = neckStartX + neckWidth + 15; // Right side of neck
        y = neckStartY + (fret - 0.5) * fretHeight;
      } else {
        x = neckStartX + (fret - 0.5) * fretWidth;
        y = neckStartY + neckHeight + 15; // Below neck
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
        className={`border rounded-lg shadow-lg ${
          settings.darkMode ? "border-gray-600" : "border-gray-300"
        }`}
        style={{ backgroundColor: theme.fretboard }}
      >
        {/* Enhanced gradient definitions */}
        <defs>
          {/* Subtle wood grain gradient */}
          <linearGradient id="woodGrain" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={theme.fretboard} stopOpacity="1" />
            <stop offset="25%" stopColor={settings.darkMode ? "#422D1C" : "#E0B080"} stopOpacity="1" />
            <stop offset="50%" stopColor={theme.fretboard} stopOpacity="1" />
            <stop offset="75%" stopColor={settings.darkMode ? "#2F1F14" : "#C8986A"} stopOpacity="1" />
            <stop offset="100%" stopColor={theme.fretboard} stopOpacity="1" />
          </linearGradient>
          
          {/* Enhanced pearl gradient with more depth */}
          <radialGradient id="pearlGradient" cx="20%" cy="20%" r="80%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="30%" stopColor="#F8F8FF" stopOpacity="1" />
            <stop offset="70%" stopColor={settings.darkMode ? "#E6E6FA" : "#F0F8FF"} stopOpacity="1" />
            <stop offset="100%" stopColor={settings.darkMode ? "#D3D3D3" : "#E0E0E0"} stopOpacity="1" />
          </radialGradient>
          
          {/* Shadow filter for depth */}
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3"/>
          </filter>
        </defs>
        
        {/* Main SVG background */}
        <rect 
          x="0" 
          y="0" 
          width={width} 
          height={height} 
          fill={theme.fretboard}
        />
        
        {renderHeadstock()}
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