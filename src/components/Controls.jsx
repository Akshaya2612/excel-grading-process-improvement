function Controls({ state, setState, model }) {
  return (
    <section className="control-panel sticky-controls">
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
    </section>
  );
}
