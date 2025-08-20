import { useSettings } from "../../context";

interface FretNumbersProps {
  maxFrets: number;
  isVertical: boolean;
  isCompact: boolean;
  neckStartX: number;
  neckStartY: number;
  neckWidth: number;
  neckHeight: number;
  fretWidth: number;
  fretHeight: number;
}

const FretNumbers = ({
  maxFrets,
  isVertical,
  isCompact,
  neckStartX,
  neckStartY,
  neckWidth,
  neckHeight,
  fretWidth,
  fretHeight,
}: FretNumbersProps) => {
  const { settings } = useSettings();

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

export default FretNumbers;