# Disco import guide

1. Open Disco and choose **Import event log**.
2. Select `event_log_synthetic.csv`.
3. Map `Case ID` to the case identifier, `Activity` to the activity, and `Timestamp` to the timestamp.
4. Use the process map and performance view to inspect the delay between `Submission Received` and `Initial Review Started`.
5. Use `disco_activity_summary.csv` to explain the two improvement targets: waiting before initial review, and repeated formula/comment work after review begins.

This synthetic log is intentionally shaped to show the manual-review bottleneck: submissions arrive in deadline clusters, while the instructor opens files serially. The interactive model uses the same story; Disco is the process-mining evidence layer.
