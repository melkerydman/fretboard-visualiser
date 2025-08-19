import { SettingsIcon } from "../ui/icons";

interface HeaderProps {
  onSettingsClick: () => void;
}

const Header = ({ onSettingsClick }: HeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6 text-[var(--color-text)]">
      <h1 className="text-3xl font-bold">Guitar Fretboard Visualiser</h1>
      <button
        onClick={onSettingsClick}
        className="p-2 rounded-lg transition-colors bg-[var(--color-button-bg)] hover:bg-[var(--color-button-bg-hover)] text-[var(--color-button-text)]"
      >
        <SettingsIcon />
      </button>
    </div>
  );
};

export default Header;
