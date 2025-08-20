import React, { useRef, useMemo } from "react";
import MusicTheory from "../../services/musicTheory";
import { FRET_MARKERS } from "../../constants";
import { useMusicalContext, useSettings } from "../../context";
import Headstock from "./Headstock";
import Fretboard from "./Fretboard";
import RecommendedCapoIndicators from "./RecommendedCapoIndicators";
import Capo from "./Capo";
import Notes from "./Notes";
import TuningLabels from "./TuningLabels";
import FretNumbers from "./FretNumbers";
import type {
  Tuning,
  Capo as CapoType,
  NotePosition,
  RecommendedCapoPosition,
  FretNumber,
  StringIndex,
} from "../../types";

// TODO: Component Extraction Progress
// ✅ Extract renderHeadstock into Headstock component
// ✅ Extract renderFretboard into Fretboard component
// ✅ Extract renderRecommendedCapoIndicators into RecommendedCapoIndicators component
// ✅ Extract renderCapo into Capo component
// ✅ Extract renderNotes into Notes component
// ✅ Extract renderTuningLabels into TuningLabels component
// ✅ Extract renderFretNumbers into FretNumbers component
// 🎉 All render functions have been extracted into components!

interface GuitarProps {
  tuning?: Tuning;
  capo?: CapoType | null;
  highlightedNotes?: number[];
  selectedNotes?: NotePosition[];
  maxFrets?: number;
  onNoteClick?: (position: NotePosition) => void;
  onNoteHover?: (position: NotePosition) => void;
  onCapoMove?: (capo: CapoType) => void;
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
        <Fretboard
          isVertical={isVertical}
          isCompact={isCompact}
          stringCount={stringCount}
          maxFrets={maxFrets}
          neckStartX={neckStartX}
          neckStartY={neckStartY}
          neckWidth={neckWidth}
          neckHeight={neckHeight}
          fretWidth={fretWidth}
          fretHeight={fretHeight}
          headstockLength={headstockLength}
          getVisualStringPosition={getVisualStringPosition}
          getStringWidth={getStringWidth}
          getStringColor={getStringColor}
        />
        <RecommendedCapoIndicators
          recommendedCapoPositions={recommendedCapoPositions}
          isVertical={isVertical}
          neckStartX={neckStartX}
          neckStartY={neckStartY}
          neckWidth={neckWidth}
          fretWidth={fretWidth}
          fretHeight={fretHeight}
          neckMargin={neckMargin}
        />
        <Capo
          capo={capo}
          isVertical={isVertical}
          stringCount={stringCount}
          neckStartX={neckStartX}
          neckStartY={neckStartY}
          neckWidth={neckWidth}
          fretWidth={fretWidth}
          fretHeight={fretHeight}
          getVisualStringPosition={getVisualStringPosition}
          onCapoMouseDown={handleCapoMouseDown}
        />
        <Notes
          notePositions={notePositions}
          selectedNotes={selectedNotes}
          isVertical={isVertical}
          isCompact={isCompact}
          neckStartX={neckStartX}
          neckStartY={neckStartY}
          neckWidth={neckWidth}
          fretWidth={fretWidth}
          fretHeight={fretHeight}
          getVisualStringPosition={getVisualStringPosition}
          isNoteGreyedOut={isNoteGreyedOut}
          onNoteClick={onNoteClick}
          onNoteHover={onNoteHover}
        />
        <TuningLabels
          tuning={tuning}
          isVertical={isVertical}
          neckStartX={neckStartX}
          neckStartY={neckStartY}
          fretWidth={fretWidth}
          fretHeight={fretHeight}
          getVisualStringPosition={getVisualStringPosition}
          getNoteName={getNoteName}
        />
        <FretNumbers
          maxFrets={maxFrets}
          isVertical={isVertical}
          isCompact={isCompact}
          neckStartX={neckStartX}
          neckStartY={neckStartY}
          neckWidth={neckWidth}
          neckHeight={neckHeight}
          fretWidth={fretWidth}
          fretHeight={fretHeight}
        />
      </svg>
    </div>
  );
};

export default Guitar;
