function DynamicFlowChart({ arrivals, model, automation }) {
  const canvas = React.useRef(null);
  const chart = React.useRef(null);

  useEffect(() => {
    if (!window.Chart || !canvas.current) return;
    if (chart.current) chart.current.destroy();

    const labels = model.weekly.map(item => `W${item.week}`);
    const observed = labels.map(label => {
      const row = arrivals.find(item => `W${item.week}` === label);
      return row ? row.incoming : 0;
    });
    const automated = observed.map(value => value * automation / 100);
    const manual = model.weekly.map(item => item.graded * (1 - automation / 100));

    chart.current = new Chart(canvas.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Submissions received', data: observed, borderColor: '#d98e2c', backgroundColor: '#fbf0de', tension: .25, fill: false },
          { label: 'Automated checks completed', data: automated, borderColor: '#2e8b57', backgroundColor: '#e4f3ea', tension: .25, fill: false },
          { label: 'Manual checks completed', data: manual, borderColor: '#3454d1', backgroundColor: '#e9edfc', tension: .25, fill: true },
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

    return () => chart.current?.destroy();
  }, [arrivals, model, automation]);

  return (
    <div className="chart chart-library">
      <canvas ref={canvas}></canvas>
    </div>
  );
}
