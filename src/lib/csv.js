function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(',');
  return lines.map(line => {
    const values = line.split(',');
    return Object.fromEntries(headers.map((header, i) => [header.trim(), values[i]?.trim()]));
  });
}

function deriveEventData(rows) {
  const sum = values => values.reduce((a, b) => a + b, 0);
  const median = values => values.slice().sort((a, b) => a - b)[Math.floor(values.length / 2)] || 0;

  const cases = {};
  rows.forEach(row => {
    (cases[row['Case ID']] ||= {})[row.Activity] = row;
  });
  const caseList = Object.values(cases);

  const durations = name => caseList.map(c =>
    c[name] ? (new Date(c[name]['Complete Timestamp']) - new Date(c[name]['Start Timestamp'])) / 60000 : 0
  );
  const formula = durations('Formula Check');
  const visual = durations('Visual / Presentation Review');
  const approval = durations('Feedback Approval');
  const queue = caseList.map(c =>
    c['Formula Check']
      ? (new Date(c['Formula Check']['Start Timestamp']) - new Date(c['Submission Received']['Complete Timestamp'])) / 60000
      : 0
  );
  const total = sum(queue) + sum(formula) + sum(visual) + sum(approval);

  const termStart = new Date('2026-01-12T00:00:00');
  const weekOf = date => `W${Math.floor((date - termStart) / 604800000) + 1}`;
  const weekly = {};
  caseList.forEach(c => {
    const arrivalWeek = weekOf(new Date(c['Submission Received']['Complete Timestamp']));
    const checkWeek = weekOf(new Date(c['Formula Check']['Start Timestamp']));
    (weekly[arrivalWeek] ||= { incoming: 0, graded: 0 }).incoming++;
    (weekly[checkWeek] ||= { incoming: 0, graded: 0 }).graded++;
  });

  return {
    weekly: Object.entries(weekly)
      .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
      .map(([week, values]) => ({ week: week.slice(1), ...values })),
    percentages: {
      waiting: sum(queue) / total * 100,
      formula: sum(formula) / total * 100,
      visual: sum(visual) / total * 100,
      approval: sum(approval) / total * 100,
    },
    formulaMedian: median(formula),
    visualMedian: median(visual),
    approvalMedian: median(approval),
    queueMedian: median(queue),
    formulaHours: sum(formula) / 60,
    cases: caseList.length,
  };
}
