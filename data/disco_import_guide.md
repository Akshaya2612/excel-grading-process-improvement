# Disco import guide

1. Open Disco and choose **Import event log**.
2. Select `event_log_synthetic.csv`.
3. Map `Case ID` to the case identifier, `Activity` to the activity, `Timestamp` to the timestamp, and `Lifecycle` to the lifecycle transition (`start` / `complete`).
4. Use the process map and performance view to inspect the queue before `Formula Check` and the active duration of that step.
5. Use the lifecycle view to distinguish arrival variability, activity duration, and the formula-check bottleneck. Use `disco_activity_summary.csv` to explain the human-owned visual/presentation review.

This synthetic log is intentionally shaped to show the manual-review bottleneck: submissions arrive in deadline clusters, while the instructor opens files serially. The interactive model uses the same story; Disco is the process-mining evidence layer.
