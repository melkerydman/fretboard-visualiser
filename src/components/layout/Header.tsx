import { SettingsIcon } from "../ui/icons";
import { useTheme } from "@/context";

interface HeaderProps {
  onSettingsClick: () => void;
}

const Header = ({ onSettingsClick }: HeaderProps) => {
  const { themeClasses } = useTheme();

  return (
    <div className={`flex justify-between items-center mb-6 ${themeClasses.text}`}>
      <h1 className="text-3xl font-bold">Guitar Fretboard Visualizer</h1>
      <button
        onClick={onSettingsClick}
        className={`p-2 rounded-lg transition-colors ${themeClasses.button}`}
      >
        <SettingsIcon />
      </button>
    </div>
  );
};

export default Header;