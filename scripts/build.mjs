import { cp, mkdir, rm } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/src', { recursive: true });
await mkdir('dist/data', { recursive: true });

await cp('index.html', 'dist/index.html');
await cp('src/styles.css', 'dist/src/styles.css');
await cp('src/analysis.css', 'dist/src/analysis.css');
await cp('src/data-loader.js', 'dist/src/data-loader.js');
await cp('src/components.jsx', 'dist/src/components.jsx');
await cp('src/main.jsx', 'dist/src/main.jsx');
await cp('data/event_log_synthetic.csv', 'dist/data/event_log_synthetic.csv');
await cp('data/weekly_flow_synthetic.csv', 'dist/data/weekly_flow_synthetic.csv');
await cp('data/disco_activity_summary.csv', 'dist/data/disco_activity_summary.csv');
await cp('data/Disco animation for event_log_synthetic.mp4', 'dist/data/Disco animation for event_log_synthetic.mp4');

console.log('Copied static site files to dist/.');
