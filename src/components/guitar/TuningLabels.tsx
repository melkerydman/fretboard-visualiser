import type { Tuning, StringIndex } from "../../types";

interface TuningLabelsProps {
  tuning: Tuning;
  isVertical: boolean;
  neckStartX: number;
  neckStartY: number;
  fretWidth: number;
  fretHeight: number;
  getVisualStringPosition: (logicalString: StringIndex) => number;
  getNoteName: (note: number) => string;
}

const TuningLabels = ({
  tuning,
  isVertical,
  neckStartX,
  neckStartY,
  fretWidth,
  fretHeight,
  getVisualStringPosition,
  getNoteName,
}: TuningLabelsProps) => {
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

export default TuningLabels;