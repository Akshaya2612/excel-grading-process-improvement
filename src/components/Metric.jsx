function Metric({ label, value, note, tone = '' }) {
  return (
    <div className="metric">
      <small>{label}</small>
      <strong className={tone}>{value}</strong>
      <span>{note}</span>
    </div>
  );
}
