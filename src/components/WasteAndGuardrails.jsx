function WasteAndGuardrails() {
  return (
    <>
      <h2>Where the waste appears</h2>
      <div className="table">
        <div className="table-row head">
          <b>Waste</b>
          <b>Current-state example</b>
          <b>Removal idea</b>
        </div>
        {[
          ['Waiting', 'Files sit 2–4 weeks', 'Trigger auto-check on upload'],
          ['Inventory', '170–440 files in flight', 'Reduce service time'],
          ['Motion', 'Re-deriving formulas', 'Diff against solved reference'],
          ['Overprocessing', 'Repeated comments from scratch', 'Draft from detected errors'],
          ['Defects / rework', 'Rubric drift under pressure', 'Apply identical rules'],
        ].map(row => (
          <div className="table-row" key={row[0]}>
            {row.map((cell, i) => i === 0 ? <b key={i}>{cell}</b> : <span key={i}>{cell}</span>)}
          </div>
        ))}
      </div>

      <div className="subsection">
        <h3>Automate structured work, audit judgment</h3>
        <div className="safer-grid">
          <article>
            <h3>Formula / logic check</h3>
            <p className="pass">SAFER: 5 / 5 passes</p>
            <p>Structured, algorithmic, frequent, enduring, and reversible. The tool can identify exact cell-level deviations.</p>
          </article>
          <article>
            <h3>Feedback writing</h3>
            <p className="partial">SAFER: partial</p>
            <p>AI can draft from detected errors, but the instructor must edit and approve tone, emphasis, and pedagogy.</p>
          </article>
        </div>
        <div className="guardrails">
          <b>Guardrails</b>
          <span>Show the exact cell/formula that triggered a flag.</span>
          <span>Route low-confidence files to full manual review.</span>
          <span>Require instructor approval before any grade is returned.</span>
          <span>Pilot on one lab before scaling.</span>
        </div>
      </div>
    </>
  );
}
