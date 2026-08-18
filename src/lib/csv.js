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
  const coefficient = values => {
    const average = sum(values) / (values.length || 1);
    const variance = values.reduce((a, b) => a + (b - average) ** 2, 0) / (values.length || 1);
    return average ? Math.sqrt(variance) / average : 0;
  };

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
  const activeTotal = sum(formula) + sum(visual) + sum(approval);

  const submissionTimes = caseList.map(c => new Date(c['Submission Received']['Complete Timestamp'])).sort((a, b) => a - b);
  const interarrivals = submissionTimes.slice(1).map((date, i) => (date - submissionTimes[i]) / 60000);

  const termStart = new Date('2026-01-12T00:00:00');
  const weekOf = date => `W${Math.floor((date - termStart) / 604800000) + 1}`;
  const weekly = {};
  caseList.forEach(c => {
    const arrivalWeek = weekOf(new Date(c['Submission Received']['Complete Timestamp']));
    const checkWeek = weekOf(new Date(c['Formula Check']['Start Timestamp']));
    (weekly[arrivalWeek] ||= { incoming: 0, graded: 0 }).incoming++;
    (weekly[checkWeek] ||= { incoming: 0, graded: 0 }).graded++;
  });

  const dayStart = new Date('2026-02-12T00:00:00');
  const dayOf = timestamp => Math.max(0, Math.min(6, Math.floor((new Date(timestamp) - dayStart) / 86400000)));
  const daily = Array.from({ length: 7 }, (_, i) => ({ week: i + 1, incoming: 0, graded: 0, formula: 0, visual: 0, approval: 0 }));
  caseList.forEach(c => {
    daily[dayOf(c['Submission Received']['Complete Timestamp'])].incoming++;
    daily[dayOf(c['Feedback Returned']['Complete Timestamp'])].graded++;
    daily[dayOf(c['Formula Check']['Complete Timestamp'])].formula++;
    daily[dayOf(c['Visual / Presentation Review']['Complete Timestamp'])].visual++;
    daily[dayOf(c['Feedback Approval']['Complete Timestamp'])].approval++;
  });

  const formulaMedian = median(formula);
  const metrics = {
    formulaMedian,
    visualMedian: median(visual),
    approvalMedian: median(approval),
    queueMedian: median(queue),
    formulaHours: sum(formula) / 60,
    ca: coefficient(interarrivals),
    cs: coefficient(formula),
    formulaServiceRate: 60 / formulaMedian,
    targetWeeklyThroughput: caseList.length,
    requiredHourlyThroughput: caseList.length / 40,
  };

  return {
    cases: caseList.length,
    weekly: Object.entries(weekly)
      .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
      .map(([week, values]) => ({ week: week.slice(1), ...values })),
    daily,
    metrics,
    percentages: {
      waiting: sum(queue) / total * 100,
      formula: sum(formula) / activeTotal * 100,
      visual: sum(visual) / activeTotal * 100,
      approval: sum(approval) / activeTotal * 100,
    },
    ...metrics,
  };
}
