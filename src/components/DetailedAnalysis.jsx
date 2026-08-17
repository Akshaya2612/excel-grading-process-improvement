function DetailedAnalysis({ model, before }) {
  return (
    <>
      <div className="subsection">
        <h3>The average hides the burst</h3>
        <p>As automated coverage increases, the average handling time falls and weekly capacity rises. The arrival burst stays the same, so the queue and time-to-feedback are what change.</p>
        <div className="metrics">
          <Metric label="Handling time / file" value={`${model.avgMinutes.toFixed(1)} min`} note={`${before.avgMinutes} min at 0% automation`} />
          <Metric label="Batch size" value="120 files" note="two-day arrival window" tone="amber" />
          <Metric label="Batch work" value={`${(120 * model.avgMinutes / 60).toFixed(1)} hours`} note="live modeled workload" tone="amber" />
          <Metric label="Peak flow time" value={`${model.flowTime.toFixed(1)} days`} note="submission → feedback" />
        </div>
        <div className="formula">Capacity = 1 resource × (60 / {model.avgMinutes.toFixed(1)} minutes) × {model.capacity > before.capacity ? '6' : '6'} hours = {model.capacity} files/week<br /><em>Automation reduces work per file; the deadline burst remains visible in the backlog chart.</em></div>
      </div>
      <div className="subsection">
        <h3>Automation should improve the whole system</h3>
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
              {row.map((cell, i) => i === 0 ? <b key={i}>{cell}</b> : <span key={i}>{cell}</span>)}
            </div>
          ))}
        </div>
        <p className="callout">Rushing the manual process would reduce flow time by sacrificing quality. Automation breaks that trade-off while keeping the instructor as grade-of-record.</p>
      </div>
    </>
  );
}
