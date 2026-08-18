const DEFAULTS = {
  automation: 0,
  manualMinutes: 24,
  quickMinutes: 6,
  hours: 40,
  accuracy: 85,
  resources: 1,
  variability: 100,
};

const arrivals = [120, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const TA_RATE = 22;

function automationTone(automation) {
  if (automation >= 70) return 'result-good';
  if (automation >= 30) return 'result-watch';
  return 'result-risk';
}

function simulate({ automation, manualMinutes, quickMinutes, hours, accuracy, resources = 1, variability = 100 }) {
  const avgMinutes = (automation / 100) * quickMinutes + (1 - automation / 100) * manualMinutes;
  const capacity = Math.max(1, Math.floor((resources * hours * 60) / avgMinutes));

  let backlog = 0;
  const weekly = arrivals.map((base, i) => {
    const incoming = base;
    const available = backlog + incoming;
    const graded = Math.min(available, capacity);
    backlog = available - graded;
    return { week: i + 1, incoming, graded, backlog };
  });

  const peakBacklog = Math.max(...weekly.map(x => x.backlog));
  const laborHours = (120 * avgMinutes) / 60;

  return {
    avgMinutes,
    capacity,
    weekly,
    peakBacklog,
    flowTime: (120 / capacity) * 7,
    consistency: Math.min(99, Math.round(72 + automation / 100 * accuracy / 100 * 27)),
    feedback: Math.round(40 + automation / 100 * 80),
    autoFrac: automation / 100,
    laborHours,
    laborCost: laborHours * TA_RATE,
    productivity: 120 / laborHours,
    utilization: Math.min(100, laborHours / (resources * hours) * 100),
    inventory: peakBacklog,
    waitingHours: Math.max(0, (120 / capacity) * 7 * 24 - avgMinutes / 60),
    qualityAccuracy: accuracy,
    hours,
  };
}
