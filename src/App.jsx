const NAV_LINKS = [
  { id: 'hero', label: 'Overview' },
  { id: 'group-1', label: '1. Current state' },
  { id: 'group-2', label: '2. Redesign' },
  { id: 'group-3', label: '3. Results' },
  { id: 'group-4', label: '4. Guardrails' },
];

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

  useEffect(() => {
    revealHero();
  }, []);

  useEffect(() => {
    onAnimeReady(() => initCardReveal());
  });

  return (
    <>
      <header className="hero" id="hero">
        <span className="eyebrow">Process improvement · interactive</span>
        <h1>The rubric was automatable. The judgment wasn’t.</h1>
        <p>Redesigning Excel project grading with process mining, automation, queueing theory, and a human-in-the-loop checker.</p>
        <div className="byline">Synthetic 120-assignment deadline burst · one-week grading target</div>
      </header>
      <nav>
        {NAV_LINKS.map(({ id, label }) => (
          <a href={`#${id}`} key={id}>{label}</a>
        ))}
      </nav>
      <Controls state={state} setState={setState} model={model} />
      <main>
        <section id="group-1" className="section">
          <div className="with-sidebar">
            <span className="eyebrow">01 · Current state & diagnosis</span>
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

            <div className="subsection">
              <h3>Define the unit, boundaries, resources, and customer</h3>
              <div className="idea-grid">
                <article>
                  <span className="idea-tag">Flow-unit</span>
                  <h3>One submitted workbook</h3>
                  <p>The flow-unit is one completed student Excel assignment. Scope begins at submission received and ends when feedback is returned. Assignment creation and post-grade appeals are outside scope.</p>
                </article>
                <article>
                  <span className="idea-tag">Resources</span>
                  <h3>Who performs the work?</h3>
                  <p>The LMS collects files, the automated checker evaluates formulas, the TA reviews presentation, and the instructor approves exceptions and individualized feedback.</p>
                </article>
                <article>
                  <span className="idea-tag">Customer outcome</span>
                  <h3>Faster, accurate, specific feedback</h3>
                  <p>Students are the customer: they need accurate grading, useful comments, and feedback returned within seven days.</p>
                </article>
              </div>
              <p className="callout"><b>Flow variation and metric priority:</b> standard work follows submission → automated formula check → visual review → feedback. Low-confidence or unusual work follows an exception path to full manual review. The primary target is formula-check effort; the guardrails are seven-day lead time, grading quality, and instructor approval.</p>
            </div>

            <div id="section-2" className="subsection">
              {eventData && (
                <>
                  <h3>The deadline creates the burst; formula checking creates the bottleneck</h3>
                  <p>This baseline is calculated from the 120-case event log. Assignments arrive in a tight deadline burst; the capacity constraint is the time required to formula-check each file.</p>
                  <div className="metrics">
                    <Metric label="Observed cases" value={eventData.cases} note="deadline-burst submissions" />
                    <Metric label="Formula check / file" value={`${eventData.formulaMedian.toFixed(0)} min`} note="repeated algorithmic work" tone="amber" />
                    <Metric label="Formula-check workload" value={`${eventData.formulaHours.toFixed(1)} h`} note="total for 120 assignments" tone="amber" />
                    <Metric label="Human review / file" value={`${(eventData.visualMedian + eventData.approvalMedian).toFixed(0)} min`} note="visual review + approval" />
                  </div>
                  <div className="efficiency">
                    <div className="efficiency-work efficiency-formula" style={{ width: `${eventData.percentages.formula}%` }}></div>
                    <div className="efficiency-work efficiency-visual" style={{ width: `${eventData.percentages.visual}%` }}></div>
                    <div className="efficiency-work efficiency-approval" style={{ width: `${eventData.percentages.approval}%` }}></div>
                    <span>formula check {`${eventData.percentages.formula.toFixed(1)}%`}</span>
                    <b>human judgment {`${(eventData.percentages.visual + eventData.percentages.approval).toFixed(1)}%`}</b>
                  </div>
                  <DynamicFlowChart arrivals={eventData.daily} model={before} automation={0} eventData={eventData} />
                  <div className="formula">Observed submissions are the deadline burst. Automated checks launch with that burst; only the remaining manual-check line is capacity constrained.<br /><em>At 100% automation, the automated-check line coincides with submissions.</em></div>
                  <div className="metrics">
                    <Metric label="Arrival variability (Ca)" value={eventData.metrics.ca.toFixed(2)} note="inter-submission timing" />
                    <Metric label="Service variability (Cs)" value={eventData.metrics.cs.toFixed(2)} note="formula-check duration" />
                    <Metric label="Formula service rate" value={`${eventData.metrics.formulaServiceRate.toFixed(1)} / hour`} note="one resource" tone="amber" />
                    <Metric label="Seven-day target rate" value={`${eventData.metrics.requiredHourlyThroughput.toFixed(1)} / hour`} note="120 files across 40 hours" tone="amber" />
                  </div>
                  <p className="callout">The deadline burst makes Ca high, while variation in checking time makes Cs nonzero. Capacity must exceed the target throughput with enough buffer to absorb both sources of variability.</p>
                </>
              )}
            </div>

            <div className="subsection">
              <h3>Process mining shows where formula work is concentrated</h3>
              <p>Import <code>data/event_log_synthetic.csv</code> into Disco using Case ID, Activity, and Timestamp. The performance view should show the queue before Formula Check and the active formula-check bottleneck.</p>
              {eventData && (
                <>
                  <h3>Interactive scenario: change the automation coverage</h3>
                  <p>This scenario chart is separate from the fixed baseline above. The controls on the left change this view and the results further down the page.</p>
                  <DynamicFlowChart arrivals={eventData.daily} model={model} automation={state.automation} eventData={eventData} />
                </>
              )}
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
              <p className="callout">The processed workflow separates arrival variability from the formula-check bottleneck; the controls on the left model automating that step while preserving human review.</p>
            </div>
          </div>
        </section>

        <div className="with-sidebar">
          <section id="group-2" className="section">
            <span className="eyebrow">02 · Redesign</span>
            <NetlifyInspiredSections model={model} before={before} />

            <div className="subsection">
              <h3>Maker–checker: automate the first pass, preserve judgment</h3>
              <p>Files flow linearly from submission to automated formula/logic checks, then to instructor review for exceptions and personalization.</p>
              <div className="pipeline">
                <div>Student upload</div>
                <div className="auto">Automated formula & logic check<br /><small>{auto}% auto-triaged</small></div>
                <div className="human">Instructor checker<br /><small>{100 - auto}% full review + sign-off</small></div>
                <div>Feedback returned</div>
              </div>
              <div className="metrics">
                <Metric label="Average handling time" value={`${model.avgMinutes.toFixed(1)} min`} note={`vs ${before.avgMinutes} min manual`} tone={automationTone(state.automation)} />
                <Metric label="Capacity" value={`${model.capacity} / week`} note="synthetic model" tone={automationTone(state.automation)} />
                <Metric label="Flow time" value={`${model.flowTime.toFixed(1)} days`} note="peak week" tone={automationTone(state.automation)} />
              </div>
            </div>
          </section>

          <section id="group-3" className="section">
            <span className="eyebrow">03 · Results & analysis</span>
            <h2>Before / after, controlled by the same model</h2>
            <p>Move the automation slider on the left. “Before” stays fixed at 0% automation so the comparison remains fair.</p>
            <div className="compare">
              <div><small>Peak flow time</small><b className={automationTone(state.automation)}>{before.flowTime.toFixed(1)} → {model.flowTime.toFixed(1)} days</b></div>
              <div><small>Weekly capacity</small><b className={automationTone(state.automation)}>{before.capacity} → {model.capacity}</b></div>
              <div><small>Consistency</small><b className={automationTone(state.automation)}>{before.consistency}% → {model.consistency}%</b></div>
              <div><small>Feedback depth</small><b className={automationTone(state.automation)}>{before.feedback} → {model.feedback} words</b></div>
            </div>
            <h3>Takeaway</h3>
            <p className="callout">The tool does not replace instructor judgment. It removes repetitive technical checking so the instructor can spend more time on specific, individualized mentorship.</p>

            <DetailedAnalysis model={model} before={before} />
          </section>
        </div>

        <section id="group-4" className="section centered">
          <span className="eyebrow">04 · Waste & guardrails</span>
          <WasteAndGuardrails />
        </section>
      </main>
      <footer className="centered">All data is synthetic. See <code>data/disco_import_guide.md</code> for the Disco workflow.</footer>
    </>
  );
}
