function parseGradingCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(',');
  return lines.map(line => { const values = line.split(','); return Object.fromEntries(headers.map((header, i) => [header.trim(), values[i]?.trim()])); });
}

function gradingDataToJson(rows) {
  const cases = {};
  rows.forEach(row => { (cases[row['Case ID']] ||= {})[row.Activity] = row; });
  const caseList = Object.values(cases);
  const durations = name => caseList.map(c => c[name] ? (new Date(c[name]['Complete Timestamp']) - new Date(c[name]['Start Timestamp'])) / 60000 : 0);
  const formula = durations('Formula Check'); const visual = durations('Visual / Presentation Review'); const approval = durations('Feedback Approval');
  const submissionTimes = caseList.map(c => new Date(c['Submission Received']['Complete Timestamp'])).sort((a,b) => a-b);
  const interarrivals = submissionTimes.slice(1).map((date, i) => (date - submissionTimes[i]) / 60000);
  const coefficient = values => { const average = values.reduce((a,b)=>a+b,0) / (values.length || 1); const variance = values.reduce((a,b)=>a + (b-average)**2, 0) / (values.length || 1); return average ? Math.sqrt(variance) / average : 0; };
  const queue = caseList.map(c => c['Formula Check'] ? (new Date(c['Formula Check']['Start Timestamp']) - new Date(c['Submission Received']['Complete Timestamp'])) / 60000 : 0);
  const total = [...queue, ...formula, ...visual, ...approval].reduce((a,b)=>a+b,0);
  const weekly = {};
  const daily = Array.from({ length: 7 }, (_, i) => ({ week: i + 1, incoming: 0, graded: 0, formula: 0, visual: 0, approval: 0 }));
  const dayOf = timestamp => Math.max(0, Math.min(6, Math.floor((new Date(timestamp) - new Date('2026-02-12T00:00:00')) / 86400000)));
  caseList.forEach(c => { const week = date => `W${Math.floor((date - new Date('2026-02-12T00:00:00')) / 604800000) + 1}`; const arrival = week(new Date(c['Submission Received']['Complete Timestamp'])); const returned = week(new Date(c['Feedback Returned']['Complete Timestamp'])); (weekly[arrival] ||= { incoming: 0, graded: 0 }).incoming++; (weekly[returned] ||= { incoming: 0, graded: 0 }).graded++; });
  caseList.forEach(c => { daily[dayOf(c['Submission Received']['Complete Timestamp'])].incoming++; daily[dayOf(c['Feedback Returned']['Complete Timestamp'])].graded++; daily[dayOf(c['Formula Check']['Complete Timestamp'])].formula++; daily[dayOf(c['Visual / Presentation Review']['Complete Timestamp'])].visual++; daily[dayOf(c['Feedback Approval']['Complete Timestamp'])].approval++; });
  const median = values => values.slice().sort((a,b)=>a-b)[Math.floor(values.length/2)] || 0;
  const formulaMedian = median(formula);
  const metrics = { formulaMedian, visualMedian: median(visual), approvalMedian: median(approval), queueMedian: median(queue), formulaHours: formula.reduce((a,b)=>a+b,0)/60, ca: coefficient(interarrivals), cs: coefficient(formula), formulaServiceRate: 60 / formulaMedian, targetWeeklyThroughput: caseList.length, requiredHourlyThroughput: caseList.length / 40 };
  const activeTotal = [...formula, ...visual, ...approval].reduce((a,b)=>a+b,0);
  const percentages = { waiting: queue.reduce((a,b)=>a+b,0)/total*100, formula: formula.reduce((a,b)=>a+b,0)/activeTotal*100, visual: visual.reduce((a,b)=>a+b,0)/activeTotal*100, approval: approval.reduce((a,b)=>a+b,0)/activeTotal*100 };
  return { cases: caseList.length, weekly: Object.entries(weekly).sort(([a],[b])=>a.localeCompare(b,undefined,{numeric:true})).map(([week, values])=>({week:week.slice(1),...values})), daily, metrics, percentages, ...metrics };
}

function loadGradingData() { return fetch('./data/event_log_synthetic.csv').then(response => { if (!response.ok) throw new Error('Could not load grading event data'); return response.text(); }).then(text => gradingDataToJson(parseGradingCsv(text))); }
