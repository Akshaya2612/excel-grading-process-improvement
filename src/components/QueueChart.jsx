function QueueChart({ data }) {
  const max = Math.max(...data.flatMap(x => [x.incoming, x.graded]));

  return (
    <div className="chart">
      <div className="chart-grid">
        {data.map(x => (
          <div className="bar-group" key={x.week}>
            <div className="bars">
              <i className="incoming" style={{ height: `${x.incoming / max * 100}%` }} />
              <i className="graded" style={{ height: `${x.graded / max * 100}%` }} />
            </div>
            <small>W{x.week}</small>
          </div>
        ))}
      </div>
      <div className="legend">
        <span className="incoming-dot" /> submissions received <span className="graded-dot" /> formula checks started
      </div>
    </div>
  );
}
