import { useMemo, useState } from "react";
import { formatArrayField } from "../utils/formatting";

export function SubmissionsPage({ navigate }) {
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
