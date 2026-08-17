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
  const queue = caseList.map(c => c['Formula Check'] ? (new Date(c['Formula Check']['Start Timestamp']) - new Date(c['Submission Received']['Complete Timestamp'])) / 60000 : 0);
  const total = [...queue, ...formula, ...visual, ...approval].reduce((a,b)=>a+b,0);
  const weekly = {};
  caseList.forEach(c => { const week = date => `W${Math.floor((date - new Date('2026-02-12T00:00:00')) / 604800000) + 1}`; const arrival = week(new Date(c['Submission Received']['Complete Timestamp'])); const returned = week(new Date(c['Feedback Returned']['Complete Timestamp'])); (weekly[arrival] ||= { incoming: 0, graded: 0 }).incoming++; (weekly[returned] ||= { incoming: 0, graded: 0 }).graded++; });
  const median = values => values.slice().sort((a,b)=>a-b)[Math.floor(values.length/2)] || 0;
  const metrics = { formulaMedian: median(formula), visualMedian: median(visual), approvalMedian: median(approval), queueMedian: median(queue), formulaHours: formula.reduce((a,b)=>a+b,0)/60 };
  const percentages = { waiting: queue.reduce((a,b)=>a+b,0)/total*100, formula: formula.reduce((a,b)=>a+b,0)/total*100, visual: visual.reduce((a,b)=>a+b,0)/total*100, approval: approval.reduce((a,b)=>a+b,0)/total*100 };
  return { cases: caseList.length, weekly: Object.entries(weekly).sort(([a],[b])=>a.localeCompare(b,undefined,{numeric:true})).map(([week, values])=>({week:week.slice(1),...values})), metrics, percentages, ...metrics };
}

function loadGradingData() { return fetch('./data/event_log_synthetic.csv').then(response => { if (!response.ok) throw new Error('Could not load grading event data'); return response.text(); }).then(text => gradingDataToJson(parseGradingCsv(text))); }
