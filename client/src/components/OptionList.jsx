export function OptionList({ type, options, value, onSelect, onToggle }) {
  return (
    <div className="option-list">
      {options.map((option) => {
        const selected =
          type === "single" ? value === option : value.includes(option);

        return (
          <button
            key={option}
            type="button"
            className={`option-card ${selected ? "selected" : ""}`}
            onClick={() => (type === "single" ? onSelect(option) : onToggle(option))}
          >
            <span className="option-text">{option}</span>
            <span className="option-indicator">{selected ? "✓" : ""}</span>
          </button>
        );
      })}
    </div>
  );
}
