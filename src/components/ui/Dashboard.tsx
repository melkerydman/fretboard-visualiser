import ModeSelector from "./ModeSelector";
import MainControls from "./MainControls";
import ChordIdentifier from "./ChordIdentifier";
import ScaleChords from "./ScaleChords";
import StatusPanel from "./StatusPanel";
import FretboardControls from "./FretboardControls";

const Dashboard = () => {
  return (
    <>
      {/* Mode Selection */}
      <ModeSelector />
      {/* Controls */}
      <MainControls />
      {/* Chord Identifier (only shown when in identifier mode) */}
      <ChordIdentifier />
      {/* Scale Chords (only shown when in scale mode) */}
      <ScaleChords />
      {/* Status Panel */}
      <StatusPanel />
      {/* Fretboard Controls */}
      <FretboardControls />
    </>
  );
};

export default Dashboard;
