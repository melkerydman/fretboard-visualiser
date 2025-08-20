import { useSettings } from "../../context";
import type { NotePosition, StringIndex, FretNumber } from "../../types";

interface NotesProps {
  notePositions: NotePosition[];
  selectedNotes: NotePosition[];
  isVertical: boolean;
  isCompact: boolean;
  neckStartX: number;
  neckStartY: number;
  neckWidth: number;
  fretWidth: number;
  fretHeight: number;
  getVisualStringPosition: (logicalString: StringIndex) => number;
  isNoteGreyedOut: (fret: FretNumber, stringIndex: StringIndex) => boolean;
  onNoteClick: (position: NotePosition) => void;
  onNoteHover: (position: NotePosition) => void;
}

const Notes = ({
  notePositions,
  selectedNotes,
  isVertical,
  isCompact,
  neckStartX,
  neckStartY,
  neckWidth,
  fretWidth,
  fretHeight,
  getVisualStringPosition,
  isNoteGreyedOut,
  onNoteClick,
  onNoteHover,
}: NotesProps) => {
  const { settings } = useSettings();

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

export default Notes;