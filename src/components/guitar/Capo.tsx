import React from "react";
import { useSettings } from "../../context";
import type { Capo as CapoType, StringIndex } from "../../types";

interface CapoProps {
  capo: CapoType | null;
  isVertical: boolean;
  stringCount: number;
  neckStartX: number;
  neckStartY: number;
  neckWidth: number;
  fretWidth: number;
  fretHeight: number;
  getVisualStringPosition: (logicalString: StringIndex) => number;
  onCapoMouseDown: (e: React.MouseEvent) => void;
}

const Capo = ({
  capo,
  isVertical,
  stringCount,
  neckStartX,
  neckStartY,
  neckWidth,
  fretWidth,
  fretHeight,
  getVisualStringPosition,
  onCapoMouseDown,
}: CapoProps) => {
  const { settings } = useSettings();

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
          onMouseDown={onCapoMouseDown}
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
          onMouseDown={onCapoMouseDown}
        />
      </g>
    );
  }
};

export default Capo;