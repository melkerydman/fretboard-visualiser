import { ThemeClasses } from '../../types/ui';
import { useTheme } from '../../context';

interface Option {
  value: string | number;
  label: string;
}

interface InputFieldProps {
  type?: "text" | "select" | "number";
  label?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options?: Option[];
  min?: number;
  max?: number;
  themeClasses?: Pick<ThemeClasses, 'text' | 'input'>;
}

const InputField = ({ 
  type = "text",
  label, 
  value, 
  onChange, 
  options = [],
  min,
  max,
  themeClasses: propThemeClasses,
  ...rest
}: InputFieldProps) => {
  const { themeClasses: contextThemeClasses } = useTheme();
  const themeClasses = propThemeClasses || { text: contextThemeClasses.text, input: contextThemeClasses.input };
  const renderInput = () => {
    switch (type) {
      case "select":
        return (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full p-2 rounded border ${themeClasses.input}`}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value) || 0)}
            className={`w-full p-2 rounded border ${themeClasses.input}`}
            {...rest}
          />
        );
      
      default:
        return (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full p-2 rounded border ${themeClasses.input}`}
            {...rest}
          />
        );
    }
  };

  return (
    <div>
      {label && (
        <label
          className={`block text-sm font-medium mb-2 ${themeClasses.text}`}
        >
          {label}
        </label>
      )}
      {renderInput()}
    </div>
  );
};

export default InputField;