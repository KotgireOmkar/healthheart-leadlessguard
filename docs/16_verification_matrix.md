# HealthHeart™ | LeadlessGuard™ Verification Traceability Matrix
**Classification:** `SIMULATION` / `SECURITY`

---

## 1. Traceability Matrix

| Requirement | Description | Test Case ID | Automated Suite | Status |
| :--- | :--- | :--- | :--- | :---: |
| **REQ-FUNC-01** | Mathematical HR Calculation ($HR = 60000 / RR$) | `FUNC-01` | Suite A | `PASS` |
| **REQ-FUNC-02** | VVI Escape Interval Timeout ($t \ge T_{esc}$) | `FUNC-02` | Suite A | `PASS` |
| **REQ-FUNC-03** | Intrinsic R-Wave Pacing Inhibition | `FUNC-03` | Suite A | `PASS` |
| **REQ-SEC-01** | Monotonic Counter Replay Attack Rejection | `SEC-01` | Suite B | `PASS` |
| **REQ-SEC-02** | AES-GCM-256 Authentication Tag Validation | `SEC-02` | Suite B | `PASS` |
| **REQ-REL-01** | Lead Disconnect Sensor Dropout Fallback | `REL-01` | Suite C | `PASS` |
| **REQ-UI-01** | Calibrated ECG Grid Scaling ($25\text{ mm/s}, 10\text{ mm/mV}$) | `UI-01` | Suite D | `PASS` |
| **REQ-SAFE-01** | Read-Only Smartphone Telemetry Path Enforcement | `SAFE-01` | Suite E | `PASS` |
| **REQ-SAFE-02** | Isolation of AI Module from Therapy Parameters | `SAFE-02` | Suite E | `PASS` |
