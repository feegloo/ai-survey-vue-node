export function FooterNav({ canContinue, onBack, onNext, isLast, isSubmitting = false }) {
  return (
    <div className="footer-nav">
      <button className="secondary-button" onClick={onBack}>
        Back
      </button>
      <button
        className="primary-button"
        onClick={onNext}
        disabled={!canContinue || isSubmitting}
      >
        {isLast ? (isSubmitting ? "Submitting..." : "Submit") : "Continue"}
      </button>
    </div>
  );
}
