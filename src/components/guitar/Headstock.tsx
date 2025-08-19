import { useSettings } from "../../context";

interface HeadstockProps {
  isVertical: boolean;
  neckStartX: number;
  neckStartY: number;
  neckWidth: number;
  neckHeight: number;
  headstockLength: number;
}

const Headstock = ({
  isVertical,
  neckStartX,
  neckStartY,
  neckWidth,
  neckHeight,
  headstockLength,
}: HeadstockProps) => {
  const { settings } = useSettings();

  if (isVertical) {
    // Vertical headstock at top
    const headstockY = neckStartY - headstockLength;
    const headstockHeight = headstockLength;
    const headstockWidth = neckWidth; // Same width as neck
    const headstockX = neckStartX;

    return (
      <rect
        key="headstock"
        x={headstockX}
        y={headstockY}
        width={headstockWidth}
        height={headstockHeight}
        fill="var(--color-fretboard)"
        stroke="var(--color-border)"
        strokeWidth="2"
        rx="6"
      />
    );
  } else {
    // Horizontal headstock position based on setting
    const headstockX = settings.headstockPosition === 'left'
      ? neckStartX - headstockLength // Left: before neck
      : neckStartX + neckWidth; // Right: after neck
    const headstockWidth = headstockLength;
    const headstockHeight = neckHeight; // Same height as neck
    const headstockY = neckStartY;

    return (
      <rect
        key="headstock"
        x={headstockX}
        y={headstockY}
        width={headstockWidth}
        height={headstockHeight}
        fill="var(--color-fretboard)"
        stroke="var(--color-border)"
        strokeWidth="2"
        rx="6"
      />
    );
  }
};

export default Headstock;