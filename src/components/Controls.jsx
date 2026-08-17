function Controls({ state, setState, model }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const start = document.getElementById('group-1');
    const end = document.getElementById('group-4');
    if (!start || !end) return;
    const navOffset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-offset')) || 0;
    const check = () => {
      const pastStart = start.getBoundingClientRect().top <= navOffset + 8;
      const pastEnd = end.getBoundingClientRect().top <= navOffset + 8;
      setVisible(pastStart && !pastEnd);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  return (
    <aside className={`control-sidebar${visible ? ' control-sidebar--visible' : ''}`}>
      <div>
        <b>Scenario controls</b>
        <span>Observed baseline stays fixed; these levers change the modeled scenario.</span>
      </div>
      <label>
        Automation coverage <output>{state.automation}%</output>
        <input
          type="range"
          min="0"
          max="100"
          value={state.automation}
          onChange={e => setState({ ...state, automation: +e.target.value })}
        />
      </label>
      <label>
        Resources <output>{state.resources}</output>
        <input
          type="range"
          min="1"
          max="3"
          value={state.resources}
          onChange={e => setState({ ...state, resources: +e.target.value })}
        />
      </label>
      <label>
        Hours / resource / week <output>{state.hours} h</output>
        <input
          type="range"
          min="2"
          max="16"
          value={state.hours}
          onChange={e => setState({ ...state, hours: +e.target.value })}
        />
      </label>
      <label>
        Submission variability <output>{state.variability}%</output>
        <input
          type="range"
          min="0"
          max="100"
          value={state.variability}
          onChange={e => setState({ ...state, variability: +e.target.value })}
        />
      </label>
      <div className="live-readout">
        <b>{model.flowTime.toFixed(1)} d</b>
        <span>scenario peak flow time</span>
      </div>
      <button onClick={() => setState(DEFAULTS)}>Reset</button>
    </aside>
  );
}
