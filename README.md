# Automating Excel Project Grading

This project models an Excel-assignment grading process and tests whether the
repeatable formula and logic checks can be automated while preserving human
judgment for presentation quality, exceptions, and individualized feedback.

The site is the project deliverable: an interactive case study built from a
synthetic 120-assignment deadline burst.

## The process being improved

The flow-unit is one submitted student workbook.

The scope begins when the workbook is submitted and ends when the grade and
feedback are returned. Assignment creation, LMS administration, and post-grade
appeals are outside the scope.

The current flow is:

```text
Submission received
  → Formula / logic check
  → Visual / presentation review
  → Feedback approval
  → Feedback returned
```

The immediate target is the repeated formula and logic check. The proposed
maker-checker design automates structured checks, routes unusual or low-
confidence work to a human, and keeps the instructor as the grade-of-record.

## What the interactive site shows

The page is grouped into four sections, each with its own scroll anchor:

1. **Current state & diagnosis** — the current-state process, flow-unit/scope/
   resources/customer definition, baseline event-log evidence with the
   seven-day feedback target, and the Disco diagnosis with an interactive
   scenario chart
2. **Redesign** — the seven-day time breakdown, improvement ideas, and the
   maker–checker redesign
3. **Results & analysis** — before/after results, the capacity analysis, and
   the flow-performance scorecard
4. **Waste & guardrails** — TIMWOOD waste, SAFER human-in-the-loop guardrails,
   and the conclusion

The baseline graph is fixed to the observed synthetic event log. The scenario
graph responds to the floating scenario controls, which stay pinned to the
left of the page while sections 1–3 are in view. Automation changes
formula-check effort, capacity, cost, productivity, utilization, and modeled
flow time; visual review and feedback approval remain human-owned work.

## Flow-performance measures

The project uses a $22/hour synthetic TA labor assumption and tracks:

- Cost per assignment
- Assignments per labor hour
- TA utilization
- Work in process
- Student lead time and flow time
- Waiting as a capacity consequence of the deadline burst
- Formula-check effort and total workload hours
- Checker accuracy as a quality proxy
- Arrival variability (`Ca`) and formula-check service variability (`Cs`)

DPMO and Sigma are intentionally not fabricated. They require formula-cell
defect counts and clearly defined defect opportunities, which are not included
in the current event log.

## Data and Disco

All data is synthetic and designed to represent 120 assignments arriving in a
tight deadline window and being completed within the one-week target.

- `data/event_log_synthetic.csv` — Disco-ready event log with one row per
  activity and both start and completion timestamps.
- `data/disco_activity_summary.csv` — interpretation of activity durations and
  the prioritized formula-check bottleneck.
- `data/disco_import_guide.md` — import instructions for Disco.
- `data/weekly_flow_synthetic.csv` — weekly arrivals, capacity, formula-check
  work, human-review work, feedback work, and backlog.
- `data/before_after_summary.csv` — supporting before/after summary values.
- `data/Disco animation for event_log_synthetic.mp4` — exported process-mining
  visualization used in the Diagnosis section.

Import the event log into Disco using:

- Case ID: `Case ID`
- Activity: `Activity`
- Start timestamp: `Start Timestamp`
- Complete timestamp: `Complete Timestamp`

## Project source files

- `index.html` — static entry point that loads React, ReactDOM, Chart.js,
  Babel, and anime.js, then fetches and compiles the sources below.
- `src/App.jsx` — page composition and the four grouped sections.
- `src/components/` — one file per reusable piece: `Metric`, `QueueChart`,
  `DynamicFlowChart`, `Controls` (the floating scenario sidebar),
  `NetlifyInspiredSections`, `DetailedAnalysis`, `WasteAndGuardrails`.
- `src/lib/simulate.js` — the scenario model (`DEFAULTS`, `simulate`,
  `automationTone`).
- `src/lib/csv.js` — converts the CSV event log into structured data in the
  browser. The CSV remains the source of truth; changing it changes the charts
  and derived metrics on reload.
- `src/lib/anime.js` — hero text reveal and scroll-triggered card animations.
- `src/styles.css` and `src/analysis.css` — page and analysis styling.
- `package.json` — npm scripts for local development and packaging without Vite.

## Run locally

From the project folder:

```bash
npm run dev
```

Open `http://localhost:4173`.

To create a deployable copy:

```bash
npm run build
```

This copies the site into `dist/`. The app does not require Vite; it uses a
small Node development server and the existing static React runtime.

## Publish with GitHub Pages

The repository is configured for GitHub Pages from the `main` branch. In the
repository settings, choose:

```text
Settings → Pages → Deploy from branch → main / root
```

The public project site is:

<https://akshaya2612.github.io/excel-grading-process-improvement/>

The project is intentionally synthetic. Its purpose is to demonstrate process
definition, process mining, bottleneck analysis, variability and capacity
reasoning, automation design, and trade-offs among cost, time, and quality.
