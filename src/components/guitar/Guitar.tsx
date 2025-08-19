import React, { useRef, useMemo } from "react";
import MusicTheory from "../../services/musicTheory";
import { FRET_MARKERS } from "../../constants";
import { useMusicalContext, useSettings } from "../../context";
import Headstock from "./Headstock";
import type {
  Tuning,
  Capo,
  NotePosition,
  RecommendedCapoPosition,
  FretNumber,
  StringIndex,
} from "../../types";

interface GuitarProps {
  tuning?: Tuning;
  capo?: Capo | null;
  highlightedNotes?: number[];
  selectedNotes?: NotePosition[];
  maxFrets?: number;
  onNoteClick?: (position: NotePosition) => void;
  onNoteHover?: (position: NotePosition) => void;
  onCapoMove?: (capo: Capo) => void;
  recommendedCapoPositions?: RecommendedCapoPosition[];
}

const Guitar: React.FC<GuitarProps> = ({
  tuning = MusicTheory.STANDARD_TUNING,
  capo = null,
  highlightedNotes = [],
  selectedNotes = [],
  maxFrets = 12,
  onNoteClick = () => {},
  onNoteHover = () => {},
  onCapoMove = () => {},
  recommendedCapoPositions = [],
}) => {
  const { settings } = useSettings();
  const stringCount = tuning.length;
  const isVertical = settings.verticalFretboard;
  const isCompact = settings.layoutSize === "compact";

  // Get musical context for smart note naming
  const { musicalContext, getNoteName } = useMusicalContext();

  // Helper function to get visual string position
  const getVisualStringPosition = (logicalString: StringIndex): number => {
    // Use explicit string order setting instead of left-handed inference
    // low-to-high: Low E (0) -> High E (5) - natural order
    // high-to-low: High E (0) -> Low E (5) - flipped order

    if (settings.stringOrder === "high-to-low") {
      return stringCount - 1 - logicalString;
    }
    return logicalString;
  };

  // Helper function to get realistic string width (based on Martin D-28)
  const getStringWidth = (logicalString: StringIndex): number => {
    // Martin D-28 string gauges: .012, .016, .025w, .032w, .042w, .054w
    // Scale these to reasonable pixel widths for visual representation
    const stringWidths = [
      4.5, // Low E (.054w) - wound, thickest
      3.8, // A (.042w) - wound
      3.2, // D (.032w) - wound
      2.2, // G (.025w) - wound, but thinner
      1.8, // B (.016) - plain steel
      1.5, // High E (.012) - plain steel, thinnest
    ];
    return stringWidths[logicalString] || 2;
  };

  // Helper function to get realistic string color (Martin D-28 style)
  const getStringColor = (logicalString: StringIndex): string => {
    // Low E, A, D, G strings are wound (bronze/phosphor bronze)
    // B and high E are plain steel
    if (logicalString <= 3) {
      // Wound strings - bronze/copper color
      return "var(--color-string-wound)";
    } else {
      // Plain steel strings - bright metallic
      return "var(--color-string-plain)";
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
    ? neckWidth + neckMargin * 2 + fretNumberSpace
    : neckWidth + neckMargin * 2 + headstockLength;
  const height = isVertical
    ? neckHeight + neckMargin * 2 + headstockLength
    : neckHeight + neckMargin * 2 + fretNumberSpace;

  // Neck positioning within SVG
  const neckStartX = isVertical
    ? neckMargin
    : settings.headstockPosition === "left"
    ? neckMargin + headstockLength // Headstock on left, neck starts after it
    : neckMargin; // Headstock on right, neck starts at margin
  const neckStartY = isVertical ? neckMargin + headstockLength : neckMargin;

  const svgRef = useRef<SVGSVGElement>(null);

  const notePositions = useMemo(() => {
    if (highlightedNotes.length === 0) return [];
    return MusicTheory.findNotePositions(
      tuning,
      highlightedNotes,
      maxFrets,
      musicalContext
    );
  }, [tuning, highlightedNotes, maxFrets, musicalContext]);

  const isNoteGreyedOut = (
    fret: FretNumber,
    stringIndex: StringIndex
  ): boolean => {
    if (!capo || fret === 0) return false;

    // capo.fromHighE means "from the High E string" (high-numbered logical strings)
    // stringIndex is the logical string (0 = low E, 5 = high E)
    const isStringCovered = capo.fromHighE
      ? stringIndex >= stringCount - capo.strings // Cover highest-numbered strings
      : stringIndex < capo.strings; // Cover lowest-numbered strings
    return isStringCovered && fret < capo.fret;
  };

  const handleCapoDrag = (e: MouseEvent): void => {
    e.preventDefault();
    if (!svgRef.current || !capo) return;

    const rect = svgRef.current.getBoundingClientRect();
    let newFret;
    if (isVertical) {
      const y = e.clientY - rect.top;
      const fretPosition = (y - neckStartY) / fretHeight;
      newFret = Math.max(1, Math.min(maxFrets, Math.floor(fretPosition) + 1));
    } else {
      const x = e.clientX - rect.left;
      if (settings.headstockPosition === "left") {
        // Normal: fret 0 at left, higher frets to the right
        newFret = Math.max(
          1,
          Math.min(maxFrets, Math.floor((x - neckStartX) / fretWidth) + 1)
        );
      } else {
        // Mirrored: fret 0 at right, higher frets to the left
        newFret = Math.max(
          1,
          Math.min(
            maxFrets,
            Math.floor((neckStartX + neckWidth - x) / fretWidth) + 1
          )
        );
      }
    }

    if (newFret !== capo.fret) {
      onCapoMove({ ...capo, fret: newFret });
    }
  };

  const handleCapoMouseDown = (e: React.MouseEvent): void => {
    e.preventDefault();
    const handleMouseMove = (e: MouseEvent) => handleCapoDrag(e);
    const handleMouseUp = (): void => {
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
          fill="var(--color-fretboard)"
          stroke="var(--color-border)"
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
            stroke={fret === 0 ? "var(--color-nut)" : "var(--color-fret)"}
            strokeWidth={fret === 0 ? "4" : "2"}
          />
        );
      }

      // Render inlay dots first (so strings appear on top)
      const fretMarkers = FRET_MARKERS;
      fretMarkers.forEach((fret) => {
        if (fret <= maxFrets) {
          const y = neckStartY + (fret - 0.5) * fretHeight;
          const markerRadius = isCompact ? 5 : 7;
          const neckCenterX = neckStartX + neckWidth / 2;
          if (fret === 12 || fret === 24) {
            // Double dots for octave markers
            elements.push(
              <g key={`marker-${fret}`}>
                <circle
                  cx={neckCenterX - 30}
                  cy={y}
                  r={markerRadius}
                  fill="url(#pearlGradient)"
                  stroke="var(--color-border)"
                  strokeWidth="0.5"
                />
                <circle
                  cx={neckCenterX + 30}
                  cy={y}
                  r={markerRadius}
                  fill="url(#pearlGradient)"
                  stroke="var(--color-border)"
                  strokeWidth="0.5"
                />
              </g>
            );
          } else {
            // Single dot
            elements.push(
              <circle
                key={`marker-${fret}`}
                cx={neckCenterX}
                cy={y}
                r={markerRadius}
                fill="url(#pearlGradient)"
                stroke="var(--color-border)"
                strokeWidth="0.5"
              />
            );
          }
        }
      });

      // Render strings extending to headstock (on top of inlays)
      for (let string = 0; string < stringCount; string++) {
        const visualString = getVisualStringPosition(string);
        const x = neckStartX + (visualString + 0.5) * fretWidth;
        const stringWidth = getStringWidth(string);
        const stringColor = getStringColor(string);
        elements.push(
          <line
            key={`string-${string}`}
            x1={x}
            y1={neckStartY - headstockLength} // Extend to top of headstock
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
        const x =
          settings.headstockPosition === "left"
            ? neckStartX + fret * fretWidth // Normal: fret 0 at left
            : neckStartX + neckWidth - fret * fretWidth; // Mirrored: fret 0 at right
        elements.push(
          <line
            key={`fret-${fret}`}
            x1={x}
            y1={neckStartY}
            x2={x}
            y2={neckStartY + neckHeight}
            stroke={fret === 0 ? "var(--color-nut)" : "var(--color-fret)"}
            strokeWidth={fret === 0 ? "3" : "1"}
          />
        );
      }

      // Render inlay dots first (so strings appear on top)
      const fretMarkers = FRET_MARKERS;
      fretMarkers.forEach((fret) => {
        if (fret <= maxFrets) {
          const x =
            settings.headstockPosition === "left"
              ? neckStartX + (fret - 0.5) * fretWidth // Normal positioning
              : neckStartX + neckWidth - (fret - 0.5) * fretWidth; // Mirrored positioning
          const markerRadius = isCompact ? 5 : 7;
          const neckCenterY = neckStartY + neckHeight / 2;
          if (fret === 12 || fret === 24) {
            // Double dots for octave markers
            elements.push(
              <g key={`marker-${fret}`}>
                <circle
                  cx={x}
                  cy={neckCenterY - 30}
                  r={markerRadius}
                  fill="url(#pearlGradient)"
                  stroke="var(--color-border)"
                  strokeWidth="0.5"
                />
                <circle
                  cx={x}
                  cy={neckCenterY + 30}
                  r={markerRadius}
                  fill="url(#pearlGradient)"
                  stroke="var(--color-border)"
                  strokeWidth="0.5"
                />
              </g>
            );
          } else {
            // Single dot
            elements.push(
              <circle
                key={`marker-${fret}`}
                cx={x}
                cy={neckCenterY}
                r={markerRadius}
                fill="url(#pearlGradient)"
                stroke="var(--color-border)"
                strokeWidth="0.5"
              />
            );
          }
        }
      });

      // Render strings extending to headstock (on top of inlays)
      for (let string = 0; string < stringCount; string++) {
        const visualString = getVisualStringPosition(string);
        const y = neckStartY + (visualString + 0.5) * fretHeight;
        const stringWidth = getStringWidth(string);
        const stringColor = getStringColor(string);
        elements.push(
          <line
            key={`string-${string}`}
            x1={
              settings.headstockPosition === "left"
                ? neckStartX - headstockLength // Extend to left headstock
                : neckStartX
            } // Start at neck
            y1={y}
            x2={
              settings.headstockPosition === "left"
                ? neckStartX + neckWidth // End at neck
                : neckStartX + neckWidth + headstockLength
            } // Extend to right headstock
            y2={y}
            stroke={stringColor}
            strokeWidth={stringWidth}
          />
        );
      }
    }

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
        const x =
          settings.headstockPosition === "left"
            ? neckStartX + (rec.fret - 0.5) * fretWidth
            : neckStartX + neckWidth - (rec.fret - 0.5) * fretWidth;
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


  const renderCapo = () => {
    if (!capo) return null;

    if (isVertical) {
      const y = neckStartY + (capo.fret - 0.5) * fretHeight;

      // Calculate which logical strings are covered (same logic as horizontal)
      const coveredStrings = [];
      if (capo.fromHighE) {
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
      const visualStrings = coveredStrings.map((s) =>
        getVisualStringPosition(s)
      );
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
            fill="var(--color-capo)"
            stroke="var(--color-capo)"
            strokeWidth="2"
            rx="4"
            className="cursor-move"
            onMouseDown={handleCapoMouseDown}
          />
        </g>
      );
    } else {
      const x =
        settings.headstockPosition === "left"
          ? neckStartX + (capo.fret - 0.5) * fretWidth
          : neckStartX + neckWidth - (capo.fret - 0.5) * fretWidth;

      // Calculate which logical strings are covered
      const coveredStrings = [];
      if (capo.fromHighE) {
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
      const visualStrings = coveredStrings.map((s) =>
        getVisualStringPosition(s)
      );
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
            fill="var(--color-capo)"
            stroke="var(--color-capo)"
            strokeWidth="2"
            rx="4"
            className="cursor-move"
            onMouseDown={handleCapoMouseDown}
          />
        </g>
      );
    }
  };

  const renderNotes = () => {
    return notePositions.map((pos, index) => {
      const isGreyed = isNoteGreyedOut(pos.fret, pos.string);

      // Check if this specific position is selected
      const selectedPosition = selectedNotes.find(
        (selPos) => selPos.string === pos.string && selPos.fret === pos.fret
      );
      const isSelected = !!selectedPosition;

      // Count how many times this note value appears in selectedNotes
      const noteOccurrences = selectedNotes.filter(
        (selPos) => selPos.note === pos.note
      );
      const occurrenceIndex = noteOccurrences.findIndex(
        (selPos) => selPos.string === pos.string && selPos.fret === pos.fret
      );

      let x, y;
      if (isVertical) {
        const visualString = getVisualStringPosition(pos.string);
        x = neckStartX + (visualString + 0.5) * fretWidth;
        y = neckStartY + (pos.fret === 0 ? -0.3 : pos.fret - 0.5) * fretHeight;
      } else {
        x =
          settings.headstockPosition === "left"
            ? neckStartX + (pos.fret === 0 ? -0.3 : pos.fret - 0.5) * fretWidth
            : neckStartX +
              neckWidth -
              (pos.fret === 0 ? -0.3 : pos.fret - 0.5) * fretWidth;
        const visualString = getVisualStringPosition(pos.string);
        y = neckStartY + (visualString + 0.5) * fretHeight;
      }

      const noteRadius = isCompact ? 8 : 12;

      // Determine note styling based on state
      let fillColor, strokeColor, opacity;
      if (isGreyed) {
        fillColor = "var(--color-note-greyed)";
        strokeColor = "var(--color-note-greyed-stroke)";
        opacity = 0.5;
      } else if (isSelected) {
        // Check if this is a capo note
        if (selectedPosition && selectedPosition.isCapo) {
          fillColor = "var(--color-note-capo)";
          strokeColor = "var(--color-note-capo-stroke)";
        } else {
          // Alternate colors for different manual selections of the same note
          if (occurrenceIndex % 2 === 0) {
            fillColor = "var(--color-note-selected)"; // Orange
            strokeColor = "var(--color-note-selected-stroke)";
          } else {
            fillColor = "var(--color-note-selected-alt)"; // Red
            strokeColor = "var(--color-note-selected-alt-stroke)";
          }
        }
        opacity = 1;
      } else {
        fillColor = "var(--color-note)";
        strokeColor = "var(--color-note-stroke)";
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
          fill="var(--color-text)"
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
        x =
          settings.headstockPosition === "left"
            ? neckStartX + (fret - 0.5) * fretWidth
            : neckStartX + neckWidth - (fret - 0.5) * fretWidth;
        y = neckStartY + neckHeight + 15; // Below neck
      }

      numbers.push(
        <text
          key={`fret-num-${fret}`}
          x={x}
          y={y}
          textAnchor="middle"
          className="text-xs"
          fill="var(--color-text)"
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
      <svg ref={svgRef} width={width} height={height}>
        {/* Enhanced gradient definitions */}
        <defs>
          {/* Subtle wood grain gradient */}
          <linearGradient id="woodGrain" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              stopColor="var(--color-fretboard)"
              stopOpacity="1"
            />
            <stop offset="25%" stopColor="#422D1C" stopOpacity="1" />
            <stop
              offset="50%"
              stopColor="var(--color-fretboard)"
              stopOpacity="1"
            />
            <stop offset="75%" stopColor="#2F1F14" stopOpacity="1" />
            <stop
              offset="100%"
              stopColor="var(--color-fretboard)"
              stopOpacity="1"
            />
          </linearGradient>

          {/* Enhanced pearl gradient with more depth */}
          <radialGradient id="pearlGradient" cx="20%" cy="20%" r="80%">
            <stop offset="0%" stopColor="var(--color-inlay)" stopOpacity="1" />
            <stop
              offset="30%"
              stopColor="var(--color-inlay)"
              stopOpacity="0.9"
            />
            <stop
              offset="70%"
              stopColor="var(--color-inlay)"
              stopOpacity="0.7"
            />
            <stop
              offset="100%"
              stopColor="var(--color-inlay)"
              stopOpacity="0.5"
            />
          </radialGradient>

          {/* Shadow filter for depth */}
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3" />
          </filter>
        </defs>

        <Headstock
          isVertical={isVertical}
          neckStartX={neckStartX}
          neckStartY={neckStartY}
          neckWidth={neckWidth}
          neckHeight={neckHeight}
          headstockLength={headstockLength}
        />
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

export default Guitar;
