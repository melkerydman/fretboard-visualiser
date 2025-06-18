const InputField = ({ 
  type = "text",
  label, 
  value, 
  onChange, 
  options = [], // for select
  min, 
  max, // for number
  themeClasses 
}) => {
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
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value) || min)}
            className={`w-full p-2 rounded border ${themeClasses.input}`}
          />
        );
      
      default:
        return (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full p-2 rounded border ${themeClasses.input}`}
          />
        );
    }
  };

  return (
    <div>
      <label
        className={`block text-sm font-medium mb-2 ${themeClasses.text}`}
      >
        {label}
      </label>
      {renderInput()}
    </div>
  );
};

export default InputField;