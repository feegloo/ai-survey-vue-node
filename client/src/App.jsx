import { usePathname } from "./hooks/usePathname";
import { SurveyPage } from "./components/SurveyPage";
import { SubmissionsPage } from "./components/SubmissionsPage";

export default function App() {
  const { pathname, navigate } = usePathname();

  if (pathname === "/submissions") {
    return <SubmissionsPage navigate={navigate} />;
  }

  return <SurveyPage navigate={navigate} />;
}

function SurveyPage({ navigate }) {
  const steps = [
    "welcome",
    "role",
    "experience",
    "goals",
    "tools",
    "problem"
  ];

  const [stepIndex, setStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    goals: [],
    tools: [],
    problem: ""
  });

  const step = steps[stepIndex];
  const progress = (stepIndex / (steps.length - 1)) * 100;

  const canContinue = (() => {
    if (step === "welcome") return true;
    if (step === "role") return Boolean(formData.role);
    if (step === "experience") return Boolean(formData.experience);
    if (step === "goals") return formData.goals.length > 0;
    if (step === "tools") return true;
    if (step === "problem") return formData.problem.trim().length > 4;
    return false;
  })();

  const next = () => {
    if (!canContinue || stepIndex >= steps.length - 1) return;
    setStepIndex((prev) => prev + 1);
  };

  const back = () => {
    if (stepIndex === 0) return;
    setStepIndex((prev) => prev - 1);
  };

  const toggleValue = (key, value) => {
    setFormData((prev) => {
      const current = prev[key];
      const exists = current.includes(value);

      return {
        ...prev,
        [key]: exists
          ? current.filter((item) => item !== value)
          : [...current, value]
      };
    });
  };

  const submit = async () => {
    if (!canContinue || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Failed to submit survey");
      }

      window.alert("Thank you for your answers");
      setStepIndex(0);
      setFormData({
        role: "",
        experience: "",
        goals: [],
        tools: [],
        problem: ""
      });
    } catch (error) {
      window.alert("Could not submit survey. Check backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="bg-gradient" />
      <header className="topbar">
        <div className="topbar-inner">
          <button
            className="ghost-link"
            onClick={() => (stepIndex === 0 ? navigate("/submissions") : back())}
          >
            {stepIndex === 0 ? "View submissions" : "← Back"}
          </button>
        </div>
        <div className="progress-track">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main className="survey-stage">
        <section className="survey-card">
          {step === "welcome" && (
            <StepFrame
              eyebrow="AI workplace onboarding"
              title="Welcome"
              description="Answer a few quick questions so we can understand your role, AI experience, tool usage, and workplace opportunities for AI."
            >
              <div className="button-row start-row">
                <button className="primary-button" onClick={next}>
                  Start survey
                </button>
              </div>
            </StepFrame>
          )}

          {step === "role" && (
            <StepFrame
              eyebrow="Question 1"
              title="What is your role?"
              description="Pick the option that fits you best."
            >
              <OptionList
                type="single"
                options={roleOptions}
                value={formData.role}
                onSelect={(value) =>
                  setFormData((prev) => ({ ...prev, role: value }))
                }
              />
              <FooterNav
                canContinue={canContinue}
                onBack={back}
                onNext={next}
                isLast={false}
              />
            </StepFrame>
          )}

          {step === "experience" && (
            <StepFrame
              eyebrow="Question 2"
              title="How much experience do you have with AI?"
              description="Choose the one that feels most accurate right now."
            >
              <OptionList
                type="single"
                options={experienceOptions}
                value={formData.experience}
                onSelect={(value) =>
                  setFormData((prev) => ({ ...prev, experience: value }))
                }
              />
              <FooterNav
                canContinue={canContinue}
                onBack={back}
                onNext={next}
                isLast={false}
              />
            </StepFrame>
          )}

          {step === "goals" && (
            <StepFrame
              eyebrow="Question 3"
              title="What are you hoping to achieve with AI?"
              description="Choose one or more."
            >
              <OptionList
                type="multi"
                options={goalOptions}
                value={formData.goals}
                onToggle={(value) => toggleValue("goals", value)}
              />
              <FooterNav
                canContinue={canContinue}
                onBack={back}
                onNext={next}
                isLast={false}
              />
            </StepFrame>
          )}

          {step === "tools" && (
            <StepFrame
              eyebrow="Question 4"
              title="Check AI tools you are using"
              description="Choose all that apply."
            >
              <ToolGrid
                options={toolOptions}
                values={formData.tools}
                onToggle={(value) => toggleValue("tools", value)}
              />
              <FooterNav
                canContinue={canContinue}
                onBack={back}
                onNext={next}
                isLast={false}
              />
            </StepFrame>
          )}

          {step === "problem" && (
            <StepFrame
              eyebrow="Question 5"
              title="Describe your problem at workplace that could be solved with AI"
              description="Write a short real example. We will use it to understand practical AI opportunities."
            >
              <textarea
                className="big-textarea"
                placeholder="Example: I spend too much time manually preparing reports, searching across internal docs, or answering repeated questions. Also, I have an idea for internal AI project that ..."
                value={formData.problem}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    problem: event.target.value
                  }))
                }
              />
              <FooterNav
                canContinue={canContinue}
                onBack={back}
                onNext={submit}
                isLast={true}
                isSubmitting={isSubmitting}
              />
            </StepFrame>
          )}
        </section>
      </main>
    </div>
  );
}

function StepFrame({ eyebrow, title, description, children }) {
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

function OptionList({ type, options, value, onSelect, onToggle }) {
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

function ToolGrid({ options, values, onToggle }) {
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

function FooterNav({ canContinue, onBack, onNext, isLast, isSubmitting = false }) {
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

function SubmissionsPage({ navigate }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useMemo(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/submissions");
        const json = await response.json();
        setRows(json.rows ?? []);
      } catch (error) {
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="app-shell">
      <div className="bg-gradient" />
      <header className="topbar">
        <div className="topbar-inner">
          <button className="ghost-link" onClick={() => navigate("/")}>
            ← Back to survey
          </button>
        </div>
      </header>

      <main className="survey-stage submissions-stage">
        <section className="submissions-card">
          <div className="step-copy">
            <div className="eyebrow">Admin view</div>
            <h1>Survey submissions</h1>
            <p>Answers sent to the HTTP endpoint and stored in SQLite.</p>
          </div>

          {loading ? (
            <div className="empty-state">Loading submissions...</div>
          ) : rows.length === 0 ? (
            <div className="empty-state">No submissions yet.</div>
          ) : (
            <div className="submissions-list">
              {rows.map((row) => (
                <article className="submission-item" key={row.id}>
                  <div className="submission-meta">
                    <span>ID #{row.id}</span>
                    <span>{new Date(row.created_at).toLocaleString()}</span>
                  </div>
                  <div className="submission-grid">
                    <div>
                      <strong>Role</strong>
                      <div>{row.role || "—"}</div>
                    </div>
                    <div>
                      <strong>Experience</strong>
                      <div>{row.experience || "—"}</div>
                    </div>
                    <div>
                      <strong>Goals</strong>
                      <div>{formatArrayField(row.goals)}</div>
                    </div>
                    <div>
                      <strong>Tools</strong>
                      <div>{formatArrayField(row.tools)}</div>
                    </div>
                    <div className="full-width">
                      <strong>Problem</strong>
                      <div>{row.problem || "—"}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function formatArrayField(value) {
  try {
    const parsed = JSON.parse(value || "[]");
    return parsed.length ? parsed.join(", ") : "—";
  } catch {
    return value || "—";
  }
}