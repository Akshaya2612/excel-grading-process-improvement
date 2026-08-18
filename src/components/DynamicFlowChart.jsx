function DynamicFlowChart({ arrivals, model, automation, eventData }) {
  const flowCanvas = React.useRef(null);
  const workloadCanvas = React.useRef(null);
  const flowChart = React.useRef(null);
  const workloadChart = React.useRef(null);

  useEffect(() => {
    if (!window.Chart || !flowCanvas.current || !workloadCanvas.current) return;
    flowChart.current?.destroy();
    workloadChart.current?.destroy();

    const labels = arrivals.map(item => `Day ${item.week}`);
    const observed = labels.map(label => {
      const row = arrivals.find(item => `Day ${item.week}` === label);
      return row ? row.incoming : 0;
    });
    const completed = labels.map(label => {
      const row = arrivals.find(item => `Day ${item.week}` === label);
      return row ? row.graded : 0;
    });
    const automated = completed.map(value => value * automation / 100);
    const manual = completed.map(value => value * (1 - automation / 100));

    flowChart.current = new Chart(flowCanvas.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Submissions received', data: observed, borderColor: '#d98e2c', backgroundColor: '#fbf0de', tension: .25, fill: false },
          { label: 'Automated checks completed', data: automated, borderColor: '#2e8b57', backgroundColor: '#e4f3ea', tension: .25, fill: false },
          { label: 'Human review completed', data: manual, borderColor: '#3454d1', backgroundColor: '#e9edfc', tension: .25, fill: true },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 250 },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Assignments' } },
          x: { title: { display: true, text: 'Week' } },
        },
        plugins: {
          legend: { position: 'bottom' },
          tooltip: { mode: 'index', intersect: false },
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
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Formula-check hours', data: formulaHours, backgroundColor: '#d98e2c' },
          { label: 'Visual review hours', data: visualHours, backgroundColor: '#3454d1' },
          { label: 'Feedback approval hours', data: approvalHours, backgroundColor: '#7b61a8' },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 250 },
        scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true, title: { display: true, text: 'Hours' } } },
        plugins: { legend: { position: 'bottom' }, tooltip: { mode: 'index', intersect: false } },
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
