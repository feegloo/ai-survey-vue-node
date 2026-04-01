import { useState } from "react";
import { ROLE_OPTIONS, EXPERIENCE_OPTIONS, GOAL_OPTIONS, TOOL_OPTIONS, SURVEY_STEPS } from "../const";
import { StepFrame } from "./StepFrame";
import { OptionList } from "./OptionList";
import { ToolGrid } from "./ToolGrid";
import { FooterNav } from "./FooterNav";

export function SurveyPage({ navigate }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    goals: [],
    tools: [],
    problem: ""
  });

  const step = SURVEY_STEPS[stepIndex];
  const progress = (stepIndex / (SURVEY_STEPS.length - 1)) * 100;

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
    if (!canContinue || stepIndex >= SURVEY_STEPS.length - 1) return;
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
                options={ROLE_OPTIONS}
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
                options={EXPERIENCE_OPTIONS}
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
                options={GOAL_OPTIONS}
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
                options={TOOL_OPTIONS}
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
