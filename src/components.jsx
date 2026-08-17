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
function DynamicFlowChart({ arrivals, model, automation }) {
  const canvas = React.useRef(null);
  const chart = React.useRef(null);
  useEffect(() => {
    if (!window.Chart || !canvas.current) return;
    if (chart.current) chart.current.destroy();
    const labels = model.weekly.map((item) => `W${item.week}`);
    const observed = labels.map((label) => {
      const row = arrivals.find((item) => `W${item.week}` === label);
      return row ? row.incoming : 0;
    });
    const automated = observed.map((value) => (value * automation) / 100);
    const manual = model.weekly.map(
      (item) => item.graded * (1 - automation / 100)
    );
    chart.current = new Chart(canvas.current, {
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
            label: "Manual checks completed",
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
    return () => chart.current?.destroy();
  }, [arrivals, model, automation]);
  return (
    <div className="chart chart-library">
      <canvas ref={canvas}></canvas>
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
          max="16"
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
