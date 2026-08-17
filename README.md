# Process Improvement Case Study — Automating Excel Project Grading

Interactive process-improvement site for automating Excel project grading.

## View it

The site is a no-build React page. Open `index.html` directly, or publish the repository root through GitHub Pages. React and Babel load from CDNs, while the editable source stays in `src/main.jsx`.

1. Push this folder's contents to a repo.
2. Repo Settings → Pages → Deploy from branch → `main` / root.
3. The page will be live at `https://<username>.github.io/<repo>/`.

## What's in this folder

- **`index.html`** — the full case study (single page, six "sheets"):
  current-state process map, baseline metrics (flow time, flow rate, feedback
  depth, grading consistency), diagnosis (queueing theory + process mining),
  the redesigned maker–checker flow, how each tool (Disco, Power
  Automate, Extend/simulation, Tableau) fits in, and before/after results.
  Sheets 2, 3, 4, and 6 are a small interactive React app (loaded from a CDN,
  no build step) sharing one control panel and one linear queueing model
  built on Little's Law — move a slider once and all four sheets recompute
  together. "Before" in Sheet 6 always isolates the automation effect by
  re-running the same model with automation coverage forced to 0%, so the
  comparison stays fair as you change other inputs.
- **`src/App.jsx`** — editable React components and the live queueing model.
- **`src/styles.css`** — editable site styling and responsive layout.
- **`index_v1_static_backup.html`** — the earlier static version, kept for
  reference only; not part of the live site.
- **`data/event_log_synthetic.csv`** — synthetic Disco-ready event log
  (Case ID, Activity, Timestamp) covering a 14-week term, four activities per
  submission: *Submission Received → Formula Check → Visual / Presentation
  Review → Feedback Approved → Feedback Returned*. The log includes separate `start` and `complete` lifecycle events for timed activities. Import directly into Disco to reproduce the process map
  used in the diagnosis section.
- **`data/disco_activity_summary.csv`** — compact interpretation of the Disco
  performance view, highlighting the queue before formula checking.
- **`data/disco_import_guide.md`** — step-by-step instructions for importing
  the event log into Disco and reproducing the bottleneck analysis.
- **`data/weekly_flow_synthetic.csv`** — weekly submissions arriving vs.
  manual grading capacity, plus formula-check counts, manual review minutes,
  feedback minutes, and ending backlog.
- **`data/before_after_summary.csv`** — the four headline metrics compared
  before vs. after the redesign, the source data behind the Sheet 6 chart.

All data is synthetic, built to illustrate direction and method rather than
reproduce a real term's grading records.

## Process methods at a glance

| Concept / tool | Where it shows up |
|---|---|
| Flow time, flow rate | Sheet 2 baseline metrics |
| Little's Law | Sheet 2 formula box |
| Theory of constraints / capacity-constrained resource | Sheet 3 diagnosis |
| Disco (process mining) | Sheet 3 diagnosis, `event_log_synthetic.csv` |
| Maker–checker design pattern | Sheet 4 redesign |
| Power Automate | Sheet 5 tools |
| Extend / discrete-event simulation | Sheet 5 tools, Sheet 6 results |
| Tableau | Sheet 5 tools (ongoing monitoring) |
