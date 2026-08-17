function NetlifyInspiredSections({ model, before }) {
  const waiting = Math.max(0, before.flowTime * 24 * 60 - before.avgMinutes);

  return (
    <>
      <section className="section">
        <span className="eyebrow">04 · Time breakdown</span>
        <h2>{before.avgMinutes.toFixed(0)} minutes of work trapped inside a {before.flowTime.toFixed(1)}-day flow</h2>
        <p>The active work is small compared with the time a submission waits. That contrast is the central Disco insight and the reason a faster first pass matters.</p>
        <div className="breakdown">
          <div className="breakdown-row">
            <b>Waiting before review</b>
            <div className="breakdown-bar queue" style={{ width: '100%' }}></div>
            <strong>{(waiting / 1440).toFixed(1)} days</strong>
          </div>
          <div className="breakdown-row">
            <b>Formula / logic check</b>
            <div className="breakdown-bar work" style={{ width: `${Math.max(8, before.avgMinutes / (before.flowTime * 24 * 60) * 100)}%` }}></div>
            <strong>{Math.max(0, before.avgMinutes - 6).toFixed(0)} min</strong>
          </div>
          <div className="breakdown-row">
            <b>Feedback writing</b>
            <div className="breakdown-bar feedback" style={{ width: `${Math.max(5, 6 / (before.flowTime * 24 * 60) * 100)}%` }}></div>
            <strong>6 min</strong>
          </div>
        </div>
      </section>
      <section className="section">
        <span className="eyebrow">05 · Improvement ideas</span>
        <h2>Remove repetition, keep the teaching</h2>
        <div className="idea-grid">
          <article>
            <span className="idea-tag">Priority 01</span>
            <h3>Automated formula checking</h3>
            <p>Compare formulas, values, named ranges, and expected outputs against a solved reference workbook.</p>
            <b>Reduces technical checking time</b>
          </article>
          <article>
            <span className="idea-tag">Priority 02</span>
            <h3>Exception triage</h3>
            <p>Route unusual workbook structures or low-confidence results to full instructor review.</p>
            <b>Protects grading judgment</b>
          </article>
          <article>
            <span className="idea-tag">Priority 03</span>
            <h3>Feedback draft assistant</h3>
            <p>Turn detected errors into a specific first draft that the instructor edits and personalizes.</p>
            <b>Increases feedback depth</b>
          </article>
          <article>
            <span className="idea-tag">Priority 04</span>
            <h3>Human approval gate</h3>
            <p>No grade or comment is returned until the instructor reviews and approves the draft.</p>
            <b>Maintains accountability</b>
          </article>
        </div>
      </section>
    </>
  );
}
