const { useEffect, useMemo, useState } = React;

const DEFAULTS = {
  automation: 0,
  manualMinutes: 24,
  quickMinutes: 6,
  hours: 6,
  accuracy: 85,
  resources: 1,
  variability: 100,
};
const arrivals = [5, 5, 5, 40, 5, 5, 5, 40, 5, 5, 5, 40, 5, 5];
const TA_RATE = 22;

function simulate({
  automation,
  manualMinutes,
  quickMinutes,
  hours,
  accuracy,
  resources = 1,
  variability = 100,
}) {
  const avgMinutes =
    (automation / 100) * quickMinutes + (1 - automation / 100) * manualMinutes;
  const capacity = Math.max(
    1,
    Math.floor((resources * hours * 60) / avgMinutes)
  );
  let backlog = 0;
  const weekly = arrivals.map((base, i) => {
    const incoming =
      i === 3 || i === 7 || i === 11
        ? Math.round(5 + (35 * variability) / 100)
        : Math.max(1, Math.round(5 + (1 - variability / 100) * (i % 2)));
    const available = backlog + incoming;
    const graded = Math.min(available, capacity);
    backlog = available - graded;
    return { week: i + 1, incoming, graded, backlog };
  });
  const peakBacklog = Math.max(...weekly.map((x) => x.backlog));
  return {
    avgMinutes,
    capacity,
    weekly,
    peakBacklog,
    flowTime: (peakBacklog / capacity) * 7,
    consistency: Math.min(
      99,
      Math.round(72 + (((automation / 100) * accuracy) / 100) * 27)
    ),
    feedback: Math.round(40 + (automation / 100) * 80),
    autoFrac: automation / 100,
    laborHours: (120 * avgMinutes) / 60,
    laborCost: ((120 * avgMinutes) / 60) * TA_RATE,
    productivity: 120 / ((120 * avgMinutes) / 60),
    utilization: Math.min(100, (((120 * avgMinutes) / 60) / (resources * hours)) * 100),
    inventory: peakBacklog,
    waitingHours: Math.max(0, (peakBacklog / capacity) * 7 * 24 - avgMinutes / 60),
    qualityAccuracy: accuracy,
  };
}

function NetlifyInspiredSections({ model, before }) {
  return (
    <>
      <section className="section">
        <span className="eyebrow">04 · Time breakdown</span>
        <h2>
          {before.avgMinutes.toFixed(0)} minutes of repeated technical work per file
        </h2>
        <p>
          The immediate target is the repeated formula and logic check—not the
          deadline burst itself. Automating that first pass reduces technical
          effort while preserving human review for presentation and pedagogy.
        </p>
        <div className="breakdown">
          <div className="breakdown-row">
            <b>Formula / logic check</b>
            <div
              className="breakdown-bar queue"
              style={{ width: "100%" }}
            ></div>
            <strong>{before.avgMinutes.toFixed(0)} min</strong>
          </div>
          <div className="breakdown-row">
            <b>Visual / presentation review</b>
            <div
              className="breakdown-bar work"
              style={{
                width: "30%",
              }}
            ></div>
            <strong>7 min</strong>
          </div>
          <div className="breakdown-row">
            <b>Feedback approval</b>
            <div
              className="breakdown-bar feedback"
              style={{
                width: `${Math.max(
                  5,
                  18
                )}%`,
              }}
            ></div>
            <strong>4 min</strong>
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
            <p>
              Compare formulas, values, named ranges, and expected outputs
              against a solved reference workbook.
            </p>
            <b>Reduces technical checking time</b>
          </article>
          <article>
            <span className="idea-tag">Priority 02</span>
            <h3>Exception triage</h3>
            <p>
              Route unusual workbook structures or low-confidence results to
              full instructor review.
            </p>
            <b>Protects grading judgment</b>
          </article>
          <article>
            <span className="idea-tag">Priority 03</span>
            <h3>Feedback draft assistant</h3>
            <p>
              Turn detected errors into a specific first draft that the
              instructor edits and personalizes.
            </p>
            <b>Increases feedback depth</b>
          </article>
          <article>
            <span className="idea-tag">Priority 04</span>
            <h3>Human approval gate</h3>
            <p>
              No grade or comment is returned until the instructor reviews and
              approves the draft.
            </p>
            <b>Maintains accountability</b>
          </article>
        </div>
      </section>
    </>
  );
}

function DetailedAnalysis({ model, before }) {
  return (
    <>
      <section className="section">
        <span className="eyebrow">06 · Capacity analysis</span>
        <h2>The average hides the burst</h2>
        <p>
          As automated coverage increases, the average handling time falls and
          weekly capacity rises. The arrival burst stays the same, so the queue
          and time-to-feedback are what change.
        </p>
        <div className="metrics">
          <Metric
            label="Handling time / file"
            value={`${model.avgMinutes.toFixed(1)} min`}
            note={`${before.avgMinutes} min at 0% automation`}
          />
          <Metric
            label="Batch size"
            value="120 files"
            note="two-day arrival window"
            tone="amber"
          />
          <Metric
            label="Batch work"
            value={`${((120 * model.avgMinutes) / 60).toFixed(1)} hours`}
            note="live modeled workload"
            tone="amber"
          />
          <Metric
            label="Peak flow time"
            value={`${model.flowTime.toFixed(1)} days`}
            note="submission → feedback"
          />
        </div>
        <div className="formula">
          Capacity = 1 resource × (60 / {model.avgMinutes.toFixed(1)} minutes) ×{" "}
          {model.capacity > before.capacity ? "6" : "6"} hours ={" "}
          {model.capacity} files/week
          <br />
          <em>
            Automation reduces work per file; the deadline burst remains visible
            in the backlog chart.
          </em>
        </div>
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
            [
              "Flow time",
              `${before.flowTime.toFixed(1)} days`,
              `${model.flowTime.toFixed(1)} days`,
            ],
            [
              "Flow rate",
              `${before.capacity} / week`,
              `${model.capacity} / week`,
            ],
            ["Cost per assignment", `$${(before.laborCost / 120).toFixed(2)}`, `$${(model.laborCost / 120).toFixed(2)}`],
            ["Assignments / labor hour", `${before.productivity.toFixed(1)}`, `${model.productivity.toFixed(1)}`],
            ["TA utilization", `${before.utilization.toFixed(0)}%`, `${model.utilization.toFixed(0)}%`],
            ["Work in process", `${before.inventory} files`, `${model.inventory} files`],
            ["Student lead time", `${before.flowTime.toFixed(1)} days`, `${model.flowTime.toFixed(1)} days`],
            ["Waiting consequence", `${before.waitingHours.toFixed(1)} h`, `${model.waitingHours.toFixed(1)} h`],
            ["Quality proxy: checker accuracy", `${before.qualityAccuracy}%`, `${model.qualityAccuracy}%`],
          ].map((row) => (
            <div className="table-row" key={row[0]}>
              {row.map((cell, i) =>
                i === 0 ? (
                  <b key={cell}>{cell}</b>
                ) : (
                  <span key={cell}>{cell}</span>
                )
              )}
            </div>
          ))}
        </div>
        <p className="callout">
          Cost uses a synthetic TA rate of $22/hour. Quality is represented by
          checker accuracy for now; DPMO and Sigma require formula-cell defect
          and opportunity data that this event log does not yet contain.
        </p>
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
            ["Waiting", "Deadline burst can create a queue", "Monitor SLA after automating the target"],
            ["Inventory", "Many files arrive at once", "Process the technical first pass immediately"],
            ["Motion", "Re-deriving formulas cell by cell", "Diff against solved reference"],
            [
              "Overprocessing",
              "Repeated comments from scratch",
              "Draft from detected errors",
            ],
            [
              "Defects / rework",
              "Rubric drift under pressure",
              "Apply identical rules",
            ],
          ].map((row) => (
            <div className="table-row" key={row[0]}>
              {row.map((cell, i) =>
                i === 0 ? (
                  <b key={cell}>{cell}</b>
                ) : (
                  <span key={cell}>{cell}</span>
                )
              )}
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
            <p>
              Structured, algorithmic, frequent, enduring, and reversible. The
              tool can identify exact cell-level deviations.
            </p>
          </article>
          <article>
            <h3>Feedback writing</h3>
            <p className="partial">SAFER: partial</p>
            <p>
              AI can draft from detected errors, but the instructor must edit
              and approve tone, emphasis, and pedagogy.
            </p>
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

function App() {
  const [state, setState] = useState(DEFAULTS);
  const [eventData, setEventData] = useState(null);
  const model = useMemo(() => simulate(state), [state]);
  const before = useMemo(() => simulate(DEFAULTS), []);
  const auto = state.automation;
  useEffect(() => {
    loadGradingData().then(setEventData).catch(console.error);
  }, []);
  return (
    <>
      <header className="hero">
        <span className="eyebrow">Process improvement · interactive</span>
        <h1>The rubric was automatable. The judgment wasn’t.</h1>
        <p>
          Redesigning Excel project grading with process mining, automation,
          queueing theory, and a human-in-the-loop checker.
        </p>
        <div className="byline">
          Synthetic 14-week term · ~120 projects per year
        </div>
      </header>
      <nav>
        {[
          "Current state",
          "Baseline",
          "Disco diagnosis",
          "Redesign",
          "Results",
        ].map((x, i) => (
          <a href={`#section-${i + 1}`} key={x}>
            {i + 1}. {x}
          </a>
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
              <p>
                Every workbook is opened, traced, and checked formula by
                formula.
              </p>
            </article>
            <article>
              <b>03</b>
              <h3>Feedback delivery</h3>
              <p>
                Grades and individualized comments are returned one student at a
                time.
              </p>
            </article>
          </div>
        </section>
        <Controls state={state} setState={setState} model={model} />
        {eventData && (
          <section id="section-2" className="section">
            <span className="eyebrow">02 · Baseline</span>
            <h2>
              The deadline creates the burst; formula checking creates the
              bottleneck
            </h2>
            <p>
              This baseline is calculated from the 120-case event log.
              Assignments arrive in a tight deadline burst; the capacity
              constraint is the time required to formula-check each file.
            </p>
            <div className="metrics">
              <Metric
                label="Observed cases"
                value={eventData.cases}
                note="deadline-burst submissions"
              />
              <Metric
                label="Formula check / file"
                value={`${eventData.formulaMedian.toFixed(0)} min`}
                note="repeated algorithmic work"
                tone="amber"
              />
              <Metric
                label="Formula-check workload"
                value={`${eventData.formulaHours.toFixed(1)} h`}
                note="total for 120 assignments"
                tone="amber"
              />
              <Metric
                label="Human review / file"
                value={`${(
                  eventData.visualMedian + eventData.approvalMedian
                ).toFixed(0)} min`}
                note="visual review + approval"
              />
            </div>
            <div className="efficiency">
              <div className="efficiency-work efficiency-formula" style={{ width: `${eventData.percentages.formula}%` }}></div>
              <div className="efficiency-work efficiency-visual" style={{ width: `${eventData.percentages.visual}%` }}></div>
              <div className="efficiency-work efficiency-approval" style={{ width: `${eventData.percentages.approval}%` }}></div>
              <span>formula check {`${eventData.percentages.formula.toFixed(1)}%`}</span>
              <b>human judgment {`${(eventData.percentages.visual + eventData.percentages.approval).toFixed(1)}%`}</b>
            </div>
            <DynamicFlowChart
              arrivals={eventData.daily}
              model={model}
              automation={state.automation}
              eventData={eventData}
            />
            <div className="formula">
              Observed submissions are the deadline burst. Automated checks
              launch with that burst; only the remaining manual-check line is
              capacity constrained.
              <br />
              <em>
                At 100% automation, the automated-check line coincides with
                submissions.
              </em>
            </div>
          </section>
        )}
        <section id="section-3" className="section">
          <span className="eyebrow">03 · Diagnosis</span>
          <h2>Process mining shows where formula work is concentrated</h2>
          <p>
            Import <code>data/event_log_synthetic.csv</code> into Disco using
            Case ID, Activity, and Timestamp. The performance view should show
            the repeated Formula Check activity and the human-owned review
            activities that follow it.
          </p>
          <div className="disco-media">
            <video
              controls
              preload="metadata"
              aria-label="Animated Disco process view"
            >
              <source
                src="./data/Disco%20animation%20for%20event_log_synthetic.mp4"
                type="video/mp4"
              />
              Your browser does not support MP4 playback.{" "}
              <a href="./data/Disco%20animation%20for%20event_log_synthetic.mp4">
                Download the Disco animation
              </a>
              .
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
              <span>
                Standard formula comments plus individualized feedback
              </span>
            </div>
          </div>
          <p className="callout">
            The processed workflow separates arrival variability from the
            target waste: repeated formula and logic checking. The controls
            model automating that step while preserving human review.
          </p>
        </section>
        <NetlifyInspiredSections model={model} before={before} />
        <section id="section-4" className="section">
          <span className="eyebrow">04 · Redesign</span>
          <h2>Maker–checker: automate the first pass, preserve judgment</h2>
          <p>
            Files flow linearly from submission to automated formula/logic
            checks, then to instructor review for exceptions and
            personalization.
          </p>
          <div className="pipeline">
            <div>Student upload</div>
            <div className="auto">
              Automated formula & logic check
              <br />
              <small>{auto}% auto-triaged</small>
            </div>
            <div className="human">
              Instructor checker
              <br />
              <small>{100 - auto}% full review + sign-off</small>
            </div>
            <div>Feedback returned</div>
          </div>
          <div className="metrics">
            <Metric
              label="Average handling time"
              value={`${model.avgMinutes.toFixed(1)} min`}
              note={`vs ${before.avgMinutes} min manual`}
              tone="green"
            />
            <Metric
              label="Capacity"
              value={`${model.capacity} / week`}
              note="synthetic model"
              tone="green"
            />
            <Metric
              label="Flow time"
              value={`${model.flowTime.toFixed(1)} days`}
              note="peak week"
              tone="green"
            />
          </div>
        </section>
        <section id="section-5" className="section">
          <span className="eyebrow">05 · Results</span>
          <h2>Before / after, controlled by the same model</h2>
          <p>
            Move the automation slider above. “Before” stays fixed at 0%
            automation so the comparison remains fair.
          </p>
          <div className="compare">
            <div>
              <small>Peak flow time</small>
              <b>
                {before.flowTime.toFixed(1)} → {model.flowTime.toFixed(1)} days
              </b>
            </div>
            <div>
              <small>Weekly capacity</small>
              <b>
                {before.capacity} → {model.capacity}
              </b>
            </div>
            <div>
              <small>Consistency</small>
              <b>
                {before.consistency}% → {model.consistency}%
              </b>
            </div>
            <div>
              <small>Feedback depth</small>
              <b>
                {before.feedback} → {model.feedback} words
              </b>
            </div>
          </div>
          <h3>Takeaway</h3>
          <p className="callout">
            The tool does not replace instructor judgment. It removes repetitive
            technical checking so the instructor can spend more time on
            specific, individualized mentorship.
          </p>
        </section>
        <DetailedAnalysis model={model} before={before} />
      </main>
      <footer>
        All data is synthetic. See <code>data/disco_import_guide.md</code> for
        the Disco workflow.
      </footer>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
