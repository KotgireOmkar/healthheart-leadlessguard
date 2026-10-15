# HealthHeart™ | LeadlessGuard™ Data Dictionary Document
**Classification:** `SIMULATION` / `MONITORING`

---

## 1. Core Data Entities

### Patient Record (`Patient`)
- `patientId`: String (Unique identifier, e.g. `PAT-001`)
- `fullName`: String (Patient full name, e.g. `Rajesh Sharma`)
- `age`: Number (Patient age in years)
- `implantDate`: String (ISO date string)
- `deviceModel`: String (`LeadlessGuard VR-Pro`)
- `serialNumber`: String (`SN-9482-TX`)
- `rhythmProfile`: String (`Sinus Baseline / Low Pacing Demand`)
- `baselineHeartRate`: Number (Nominal intrinsic heart rate in BPM)
- `pacingBurdenPercent`: Number (Pacing ratio $0-100\%$)
- `lowerRateLimit`: Number (Escape rate threshold in BPM, default $60$)
- `leadImpedanceOhms`: Number (Bipolar lead impedance, default $580\ \Omega$)
- `batteryPercentage`: Number (Remaining cell capacity, default $92\%$)
- `batteryLongevityYears`: Number (Estimated years remaining, default $8.4$)
- `telemetryStatus`: Enum (`ONLINE` | `STANDBY` | `WARNING`)

### Telemetry Packet (`TelemetryPacket`)
- `packetId`: String (Unique UUID)
- `sequenceNumber`: Number (Monotonically increasing integer)
- `observedAt`: String (ISO timestamp)
- `heartRateBpm`: Number (Computed heart rate)
- `pacingActive`: Boolean (True if pulse delivered)
- `spo2Percent`: Number (Oxygen saturation, nominal $98\%$)
- `impedanceOhms`: Number (Thoracic BIA impedance)
- `signalQuality`: Enum (`GOOD` | `ACCEPTABLE` | `POOR` | `UNAVAILABLE`)
