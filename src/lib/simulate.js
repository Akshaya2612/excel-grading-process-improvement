const DEFAULTS = {
  automation: 0,
  manualMinutes: 24,
  quickMinutes: 6,
  hours: 6,
  accuracy: 85,
  resources: 1,
  variability: 100,
};

const arrivals = [5, 5, 5, 40, 5, 5, 5, 40, 5, 5, 5, 40, 5, 5];

function simulate({ automation, manualMinutes, quickMinutes, hours, accuracy, resources = 1, variability = 100 }) {
  const avgMinutes = (automation / 100) * quickMinutes + (1 - automation / 100) * manualMinutes;
  const capacity = Math.max(1, Math.floor((resources * hours * 60) / avgMinutes));

  let backlog = 0;
  const weekly = arrivals.map((base, i) => {
    const isBurstWeek = i === 3 || i === 7 || i === 11;
    const incoming = isBurstWeek
      ? Math.round(5 + 35 * variability / 100)
      : Math.max(1, Math.round(5 + (1 - variability / 100) * (i % 2)));
    const available = backlog + incoming;
    const graded = Math.min(available, capacity);
    backlog = available - graded;
    return { week: i + 1, incoming, graded, backlog };
  });

  const peakBacklog = Math.max(...weekly.map(x => x.backlog));

  return {
    avgMinutes,
    capacity,
    weekly,
    peakBacklog,
    flowTime: (peakBacklog / capacity) * 7,
    consistency: Math.min(99, Math.round(72 + automation / 100 * accuracy / 100 * 27)),
    feedback: Math.round(40 + automation / 100 * 80),
    autoFrac: automation / 100,
  };
}
