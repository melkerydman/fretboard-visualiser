import type { LayoutSize } from "../../../types";

interface LayoutIconProps {
  type: LayoutSize;
  className?: string;
}

const LayoutIcon = ({ type, className = "w-8 h-8" }: LayoutIconProps) => {
  switch (type) {
    case "compact":
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <rect x="2" y="3" width="20" height="4" rx="1" />
          <rect x="2" y="9" width="20" height="4" rx="1" />
          <rect x="2" y="15" width="20" height="4" rx="1" />
        </svg>
      );
    case "comfortable":
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <rect x="2" y="3" width="20" height="6" rx="1" />
          <rect x="2" y="12" width="20" height="9" rx="1" />
        </svg>
      );
    case "spacious":
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <rect x="2" y="3" width="9" height="18" rx="1" />
          <rect x="13" y="3" width="9" height="18" rx="1" />
        </svg>
      );
    default:
      return null;
  }
};

export default LayoutIcon;