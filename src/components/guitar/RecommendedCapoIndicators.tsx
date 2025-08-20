import { useSettings } from "../../context";
import type { RecommendedCapoPosition } from "../../types";

interface RecommendedCapoIndicatorsProps {
  recommendedCapoPositions: RecommendedCapoPosition[];
  isVertical: boolean;
  neckStartX: number;
  neckStartY: number;
  neckWidth: number;
  fretWidth: number;
  fretHeight: number;
  neckMargin: number;
}

const RecommendedCapoIndicators = ({
  recommendedCapoPositions,
  isVertical,
  neckStartX,
  neckStartY,
  neckWidth,
  fretWidth,
  fretHeight,
  neckMargin,
}: RecommendedCapoIndicatorsProps) => {
  const { settings } = useSettings();

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

export default RecommendedCapoIndicators;