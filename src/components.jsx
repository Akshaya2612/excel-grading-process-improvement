const { useEffect } = React;

function Metric({ label, value, note, tone = "" }) {
  return (
    <div className="metric">
      <small>{label}</small>
      <strong className={tone}>{value}</strong>
      <span>{note}</span>
    </div>
  );
}

function QueueChart({ data }) {
  const max = Math.max(...data.flatMap((x) => [x.incoming, x.graded]));
  return (
    <div className="chart">
      <div className="chart-grid">
        {data.map((x) => (
          <div className="bar-group" key={x.week}>
            <div className="bars">
              <i
                className="incoming"
                style={{ height: `${(x.incoming / max) * 100}%` }}
              />
              <i
                className="graded"
                style={{ height: `${(x.graded / max) * 100}%` }}
              />
            </div>
            <small>W{x.week}</small>
          </div>
        ))}
      </div>
      <div className="legend">
        <span className="incoming-dot" /> submissions received{" "}
        <span className="graded-dot" /> assignments graded and returned
      </div>
    </div>
  );
}
function DynamicFlowChart({ arrivals, model, automation, eventData }) {
  const flowCanvas = React.useRef(null);
  const workloadCanvas = React.useRef(null);
  const flowChart = React.useRef(null);
  const workloadChart = React.useRef(null);
  useEffect(() => {
    if (!window.Chart || !flowCanvas.current || !workloadCanvas.current) return;
    flowChart.current?.destroy();
    workloadChart.current?.destroy();
    const labels = arrivals.map((item) => `Day ${item.week}`);
    const observed = labels.map((label) => {
      const row = arrivals.find((item) => `Day ${item.week}` === label);
      return row ? row.incoming : 0;
    });
    const completed = labels.map((label) => {
      const row = arrivals.find((item) => `Day ${item.week}` === label);
      return row ? row.graded : 0;
    });
    const automated = completed.map((value) => (value * automation) / 100);
    const manual = completed.map((value) => value * (1 - automation / 100));
    flowChart.current = new Chart(flowCanvas.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Submissions received",
            data: observed,
            borderColor: "#d98e2c",
            backgroundColor: "#fbf0de",
            tension: 0.25,
            fill: false,
          },
          {
            label: "Automated checks completed",
            data: automated,
            borderColor: "#2e8b57",
            backgroundColor: "#e4f3ea",
            tension: 0.25,
            fill: false,
          },
          {
            label: "Human review completed",
            data: manual,
            borderColor: "#3454d1",
            backgroundColor: "#e9edfc",
            tension: 0.25,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 250 },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Assignments" },
          },
          x: { title: { display: true, text: "Week" } },
        },
        plugins: {
          legend: { position: "bottom" },
          tooltip: { mode: "index", intersect: false },
        },
      },
    });
    const cases = eventData?.cases || 120;
    const formulaMinutes = eventData?.formulaMedian || 24;
    const visualMinutes = eventData?.visualMedian || 7;
    const approvalMinutes = eventData?.approvalMedian || 4;
    const formulaHours = arrivals.map(day => (day.formula * formulaMinutes * (1 - automation / 100)) / 60);
    const visualHours = arrivals.map(day => (day.visual * visualMinutes) / 60);
    const approvalHours = arrivals.map(day => (day.approval * approvalMinutes) / 60);
    workloadChart.current = new Chart(workloadCanvas.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          { label: "Formula-check hours", data: formulaHours, backgroundColor: "#d98e2c" },
          { label: "Visual review hours", data: visualHours, backgroundColor: "#3454d1" },
          { label: "Feedback approval hours", data: approvalHours, backgroundColor: "#7b61a8" },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 250 },
        scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true, title: { display: true, text: "Hours" } } },
        plugins: { legend: { position: "bottom" }, tooltip: { mode: "index", intersect: false } },
      },
    });
    return () => {
      flowChart.current?.destroy();
      workloadChart.current?.destroy();
    };
  }, [arrivals, model, automation, eventData]);
  return (
    <div className="chart-stack">
      <div className="chart chart-library"><canvas ref={flowCanvas}></canvas></div>
      <div className="chart chart-library"><canvas ref={workloadCanvas}></canvas></div>
    </div>
  );
}


function Controls({ state, setState, model }) {
  return (
    <section className="control-panel sticky-controls">
      <div>
        <b>Scenario controls</b>
        <span>
          Observed baseline stays fixed; these levers change the modeled
          scenario.
        </span>
      </div>
      <label>
        Automation coverage <output>{state.automation}%</output>
        <input
          type="range"
          min="0"
          max="100"
          value={state.automation}
          onChange={(e) => setState({ ...state, automation: +e.target.value })}
        />
      </label>
      <label>
        Resources <output>{state.resources}</output>
        <input
          type="range"
          min="1"
          max="3"
          value={state.resources}
          onChange={(e) => setState({ ...state, resources: +e.target.value })}
        />
      </label>
      <label>
        Hours / resource / week <output>{state.hours} h</output>
        <input
          type="range"
          min="2"
          max="60"
          value={state.hours}
          onChange={(e) => setState({ ...state, hours: +e.target.value })}
        />
      </label>
      <label>
        Submission variability <output>{state.variability}%</output>
        <input
          type="range"
          min="0"
          max="100"
          value={state.variability}
          onChange={(e) => setState({ ...state, variability: +e.target.value })}
        />
      </label>
      <div className="live-readout">
        <b>{model.flowTime.toFixed(1)} d</b>
        <span>scenario peak flow time</span>
      </div>
      <button onClick={() => setState(DEFAULTS)}>Reset</button>
    </section>
  );
}

window.Metric = Metric;
window.QueueChart = QueueChart;
window.DynamicFlowChart = DynamicFlowChart;
window.Controls = Controls;
