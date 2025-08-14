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
}

const InputField = ({ 
  type = "text",
  label, 
  value, 
  onChange, 
  options = [],
  min,
  max,
  ...rest
}: InputFieldProps) => {
  const renderInput = () => {
    const inputClasses = "w-full p-2 rounded border bg-[var(--color-input-bg)] border-[var(--color-input-border)] text-[var(--color-input-text)] focus:border-[var(--color-border-focus)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]";
    
    switch (type) {
      case "select":
        return (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={inputClasses}
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
            className={inputClasses}
            min={min}
            max={max}
            {...rest}
          />
        );
      
      default:
        return (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={inputClasses}
            {...rest}
          />
        );
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-2 text-[var(--color-text)]">
          {label}
        </label>
      )}
      {renderInput()}
    </div>
  );
};

export default InputField;