function App() {
  const [state, setState] = useState(DEFAULTS);
  const [eventData, setEventData] = useState(null);
  const model = useMemo(() => simulate(state), [state]);
  const before = useMemo(() => simulate(DEFAULTS), []);
  const auto = state.automation;

  useEffect(() => {
    fetch('./data/event_log_synthetic.csv')
      .then(r => r.text())
      .then(text => setEventData(deriveEventData(parseCsv(text))));
  }, []);

  return (
    <>
      <header className="hero">
        <span className="eyebrow">Process improvement · interactive</span>
        <h1>The rubric was automatable. The judgment wasn’t.</h1>
        <p>Redesigning Excel project grading with process mining, automation, queueing theory, and a human-in-the-loop checker.</p>
        <div className="byline">Synthetic 14-week term · ~120 projects per year</div>
      </header>
      <nav>
        {['Current state', 'Baseline', 'Disco diagnosis', 'Redesign', 'Results'].map((x, i) => (
          <a href={`#section-${i + 1}`} key={x}>{i + 1}. {x}</a>
        ))}
      </nav>
      <main>
        <section id="section-1" className="section">
          <span className="eyebrow">01 · Current state</span>
          <h2>Three steps, one single-threaded resource</h2>
          <div className="flow">
            <article>
              <b>01</b>
              <h3>Submission collection</h3>
              <p>Students upload completed work through the LMS.</p>
            </article>
            <article className="bottleneck">
              <b>02 · bottleneck</b>
              <h3>Manual review & grading</h3>
              <p>Every workbook is opened, traced, and checked formula by formula.</p>
            </article>
            <article>
              <b>03</b>
              <h3>Feedback delivery</h3>
              <p>Grades and individualized comments are returned one student at a time.</p>
            </article>
          </div>
        </section>

        <Controls state={state} setState={setState} model={model} />

        {eventData && (
          <section id="section-2" className="section">
            <span className="eyebrow">02 · Baseline</span>
            <h2>The deadline creates the burst; formula checking creates the bottleneck</h2>
            <p>This baseline is calculated from the 120-case event log. Assignments arrive in a tight deadline burst; the capacity constraint is the time required to formula-check each file.</p>
            <div className="metrics">
              <Metric label="Observed cases" value={eventData.cases} note="deadline-burst submissions" />
              <Metric label="Formula check / file" value={`${eventData.formulaMedian.toFixed(0)} min`} note="repeated algorithmic work" tone="amber" />
              <Metric label="Formula-check workload" value={`${eventData.formulaHours.toFixed(1)} h`} note="total for 120 assignments" tone="amber" />
              <Metric label="Human review / file" value={`${(eventData.visualMedian + eventData.approvalMedian).toFixed(0)} min`} note="visual review + approval" />
            </div>
            <div className="efficiency">
              <div className="efficiency-work" style={{ width: `${100 - eventData.percentages.waiting}%` }}></div>
              <span>formula + human review {`${(100 - eventData.percentages.waiting).toFixed(1)}%`}</span>
              <b>queue consequence {`${eventData.percentages.waiting.toFixed(1)}%`}</b>
            </div>
            <DynamicFlowChart arrivals={eventData.weekly} model={model} automation={state.automation} />
            <div className="formula">Observed submissions are the deadline burst. Automated checks launch with that burst; only the remaining manual-check line is capacity constrained.<br /><em>At 100% automation, the automated-check line coincides with submissions.</em></div>
          </section>
        )}

        <section id="section-3" className="section">
          <span className="eyebrow">03 · Diagnosis</span>
          <h2>Process mining shows where formula work is concentrated</h2>
          <p>Import <code>data/event_log_synthetic.csv</code> into Disco using Case ID, Activity, and Timestamp. The performance view should show the queue before Formula Check and the active formula-check bottleneck.</p>
          <div className="disco-media">
            <video controls preload="metadata" aria-label="Animated Disco process view">
              <source src="./data/Disco%20animation%20for%20event_log_synthetic.mp4" type="video/mp4" />
              Your browser does not support MP4 playback. <a href="./data/Disco%20animation%20for%20event_log_synthetic.mp4">Download the Disco animation</a>.
            </video>
            <p>Disco process view generated from the synthetic event log.</p>
          </div>
          <div className="evidence">
            <div>
              <b>Activity</b>
              <b>Median elapsed time</b>
              <b>Interpretation</b>
              <span>Submission Received</span>
              <span>—</span>
              <span>Upload enters the flow</span>
              <span>Formula Check</span>
              <strong>23 min</strong>
              <span>Manual formula and logic checking</span>
              <span>Visual / Presentation Review</span>
              <strong>7 min</strong>
              <span>Human judgment remains required</span>
              <span>Feedback Returned</span>
              <strong>4 min</strong>
              <span>Standard formula comments plus individualized feedback</span>
            </div>
          </div>
          <p className="callout">The processed workflow separates arrival variability from the formula-check bottleneck; the sticky controls below model automating that step while preserving human review.</p>
        </section>
        <NetlifyInspiredSections model={model} before={before} />

        <section id="section-4" className="section">
          <span className="eyebrow">04 · Redesign</span>
          <h2>Maker–checker: automate the first pass, preserve judgment</h2>
          <p>Files flow linearly from submission to automated formula/logic checks, then to instructor review for exceptions and personalization.</p>
          <div className="pipeline">
            <div>Student upload</div>
            <div className="auto">Automated formula & logic check<br /><small>{auto}% auto-triaged</small></div>
            <div className="human">Instructor checker<br /><small>{100 - auto}% full review + sign-off</small></div>
            <div>Feedback returned</div>
          </div>
          <div className="metrics">
            <Metric label="Average handling time" value={`${model.avgMinutes.toFixed(1)} min`} note={`vs ${before.avgMinutes} min manual`} tone="green" />
            <Metric label="Capacity" value={`${model.capacity} / week`} note="synthetic model" tone="green" />
            <Metric label="Flow time" value={`${model.flowTime.toFixed(1)} days`} note="peak week" tone="green" />
          </div>
        </section>

        <section id="section-5" className="section">
          <span className="eyebrow">05 · Results</span>
          <h2>Before / after, controlled by the same model</h2>
          <p>Move the automation slider above. “Before” stays fixed at 0% automation so the comparison remains fair.</p>
          <div className="compare">
            <div><small>Peak flow time</small><b>{before.flowTime.toFixed(1)} → {model.flowTime.toFixed(1)} days</b></div>
            <div><small>Weekly capacity</small><b>{before.capacity} → {model.capacity}</b></div>
            <div><small>Consistency</small><b>{before.consistency}% → {model.consistency}%</b></div>
            <div><small>Feedback depth</small><b>{before.feedback} → {model.feedback} words</b></div>
          </div>
          <h3>Takeaway</h3>
          <p className="callout">The tool does not replace instructor judgment. It removes repetitive technical checking so the instructor can spend more time on specific, individualized mentorship.</p>
        </section>
        <DetailedAnalysis model={model} before={before} />
      </main>
      <footer>All data is synthetic. See <code>data/disco_import_guide.md</code> for the Disco workflow.</footer>
    </>
  );
}
