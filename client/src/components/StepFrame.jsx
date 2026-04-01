export function StepFrame({ eyebrow, title, description, children }) {
  return (
    <div className="step-frame">
      <div className="step-copy">
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="step-content">{children}</div>
    </div>
  );
}
