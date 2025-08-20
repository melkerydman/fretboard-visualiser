import { FRET_MARKERS } from "../../constants";
import { useSettings } from "../../context";
import type { StringIndex } from "../../types";

interface FretboardProps {
  isVertical: boolean;
  isCompact: boolean;
  stringCount: number;
  maxFrets: number;
  neckStartX: number;
  neckStartY: number;
  neckWidth: number;
  neckHeight: number;
  fretWidth: number;
  fretHeight: number;
  headstockLength: number;
  getVisualStringPosition: (logicalString: StringIndex) => number;
  getStringWidth: (logicalString: StringIndex) => number;
  getStringColor: (logicalString: StringIndex) => string;
}

const Fretboard = ({
  isVertical,
  isCompact,
  stringCount,
  maxFrets,
  neckStartX,
  neckStartY,
  neckWidth,
  neckHeight,
  fretWidth,
  fretHeight,
  headstockLength,
  getVisualStringPosition,
  getStringWidth,
  getStringColor,
}: FretboardProps) => {
  const { settings } = useSettings();

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

  return <>{elements}</>;
};

export default Fretboard;