function DetailedAnalysis({ model, before }) {
  return (
    <>
      <section className="section">
        <span className="eyebrow">06 · Capacity analysis</span>
        <h2>The average hides the burst</h2>
        <p>As automated coverage increases, the average handling time falls and weekly capacity rises. The arrival burst stays the same, so the queue and time-to-feedback are what change.</p>
        <div className="metrics">
          <Metric label="Handling time / file" value={`${model.avgMinutes.toFixed(1)} min`} note={`${before.avgMinutes} min at 0% automation`} />
          <Metric label="Batch size" value="120 files" note="two-day arrival window" tone="amber" />
          <Metric label="Batch work" value={`${(120 * model.avgMinutes / 60).toFixed(1)} hours`} note="live modeled workload" tone="amber" />
          <Metric label="Peak flow time" value={`${model.flowTime.toFixed(1)} days`} note="submission → feedback" />
        </div>
        <div className="formula">Capacity = 1 resource × (60 / {model.avgMinutes.toFixed(1)} minutes) × {model.capacity > before.capacity ? '6' : '6'} hours = {model.capacity} files/week<br /><em>Automation reduces work per file; the deadline burst remains visible in the backlog chart.</em></div>
      </section>
      <section className="section">
        <span className="eyebrow">07 · Metrics and trade-offs</span>
        <h2>Automation should improve the whole system</h2>
        <div className="table">
          <div className="table-row head">
            <b>Metric</b>
            <b>Current model</b>
            <b>At {Math.round(model.autoFrac * 100)}% automation</b>
          </div>
          {[
            ['Flow time', `${before.flowTime.toFixed(1)} days`, `${model.flowTime.toFixed(1)} days`],
            ['Flow rate', `${before.capacity} / week`, `${model.capacity} / week`],
            ['Feedback depth', `${before.feedback} words`, `${model.feedback} words`],
            ['Consistency', `${before.consistency}%`, `${model.consistency}%`],
          ].map(row => (
            <div className="table-row" key={row[0]}>
              {row.map((cell, i) => i === 0 ? <b key={cell}>{cell}</b> : <span key={cell}>{cell}</span>)}
            </div>
          ))}
        </div>
        <p className="callout">Rushing the manual process would reduce flow time by sacrificing quality. Automation breaks that trade-off while keeping the instructor as grade-of-record.</p>
      </section>
      <section className="section">
        <span className="eyebrow">08 · TIMWOOD waste</span>
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
              {row.map((cell, i) => i === 0 ? <b key={cell}>{cell}</b> : <span key={cell}>{cell}</span>)}
            </div>
          ))}
        </div>
      </section>
      <section className="section">
        <span className="eyebrow">09 · SAFER + human in the loop</span>
        <h2>Automate structured work, audit judgment</h2>
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
      </section>
    </>
  );
}
