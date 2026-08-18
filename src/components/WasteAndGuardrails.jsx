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
          ['Waiting', 'Deadline burst can create a queue', 'Monitor SLA after automating the target'],
          ['Inventory', 'Many files arrive at once', 'Process the technical first pass immediately'],
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
        <div className="table table-2col">
          <div className="table-row head"><b>Criterion</b><b>Why formula checking fits</b></div>
          {[
            ['S · Structured', 'The checker compares known cells, formulas, named ranges, and expected outputs.'],
            ['A · Algorithmic', 'Rules can evaluate correctness consistently without interpreting presentation quality.'],
            ['F · Frequent', 'The same technical checks repeat across every submitted workbook.'],
            ['E · Enduring', 'The rubric and reference workbook can be reused across assignments and terms.'],
            ['R · Reversible', 'Flags can be audited, corrected, and routed back to a human reviewer.'],
            ['V · Valuable', 'Students receive faster, more consistent technical feedback while instructor time shifts to coaching.'],
          ].map(([criterion, reason]) => (
            <div className="table-row" key={criterion}><b>{criterion}</b><span>{reason}</span></div>
          ))}
        </div>
        <div className="guardrails">
          <b>Guardrails</b>
          <span>Show the exact cell/formula that triggered a flag.</span>
          <span>Route low-confidence files to full manual review.</span>
          <span>Require instructor approval before any grade is returned.</span>
          <span>Pilot on one lab before scaling.</span>
        </div>
      </div>

      <div className="subsection">
        <h3>Automate the repeatable work; protect the judgment</h3>
        <p>The deadline burst is predictable, but the immediate opportunity is the repeated formula and logic check on every workbook. Automating that structured first pass reduces cost and effort while preserving human review for presentation quality, exceptions, and individualized feedback.</p>
        <div className="callout">Success means formula-check hours fall, the seven-day feedback target remains protected, and grading quality does not decline.</div>
      </div>
    </>
  );
}
