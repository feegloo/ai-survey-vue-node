export function ToolGrid({ options, values, onToggle }) {
  return (
    <div className="tool-grid">
      {options.map((option) => {
        const selected = values.includes(option);

        return (
          <button
            key={option}
            type="button"
            className={`tool-chip ${selected ? "selected" : ""}`}
            onClick={() => onToggle(option)}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
