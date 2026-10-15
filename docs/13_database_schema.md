# HealthHeart™ | LeadlessGuard™ Database Schema Specification
**Classification:** `MONITORING` / `SECURITY`

---

## 1. MongoDB Mongoose Collections

- `patients`: Stores canonical patient profiles (`PAT-001` through `PAT-005`), serial numbers, baseline vitals, and pacing thresholds.
- `telemetry`: High-frequency time-series collection storing ECG, PPG, SpO2, and BIA samples.
- `alerts`: Clinical alarms with severity tags (`CRITICAL_ALARM`, `WARNING`, `ADVISORY`), timestamps, and acknowledgement status.
- `audit_records`: Append-only cryptographic ledger tracking actor roles, actions, timestamps, and previous/current block SHA-256 hashes.
- `scenarios`: Pre-configured electrophysiology benchmark scenarios with execution histories.
