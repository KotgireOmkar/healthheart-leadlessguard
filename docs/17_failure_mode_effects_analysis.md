# HealthHeart™ | LeadlessGuard™ Failure Mode and Effects Analysis (FMEA)
**Classification:** `SIMULATION` / `SECURITY`

---

## 1. System Failure Modes & Compensating Controls

| Component | Potential Failure Mode | Root Cause | Severity | Probability | Compensating Control |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Telemetry Radio** | Packet loss burst | Radio frequency interference | Medium | Medium | In-memory gap buffer interpolation |
| **Sense Amplifier** | Inappropriate inhibition | High-frequency skeletal muscle noise | High | Low | Dynamic bandpass filter ($0.5-40\text{ Hz}$) |
| **Battery Subsystem** | Accelerated depletion | BLE packet spam / connection flooding | High | Low | Hardware duty-cycle governor rate limiter |
| **Security Layer** | Replay injection | Stale telemetry packet broadcast | High | Low | Monotonic sequence counters & 5000ms expiry |
