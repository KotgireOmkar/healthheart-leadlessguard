# HealthHeart™ | LeadlessGuard™ Simulator API Specification
**Classification:** `SIMULATION` / `MONITORING`

---

## 1. REST Endpoints (Express Gateway - Port 5000)

### `GET /api/health`
- **Description:** System health check and database connectivity diagnostic.
- **Response:**
  ```json
  { "status": "UP", "database": "CONNECTED", "protocol": "BLE-5.3-AES-GCM" }
  ```

### `GET /api/patients`
- **Description:** Retrieve all canonical clinical patient profiles.
- **Response:** Array of `Patient` objects.

### `GET /api/patients/:id`
- **Description:** Retrieve single patient by ID.

### `POST /api/patients/:id/reprogram`
- **Description:** Submit simulated pacing parameter change through approval gate.
- **Body:**
  ```json
  {
    "lowerRateLimit": 70,
    "requestingRole": "Clinician-Simulation",
    "justification": "Resting bradycardia compensation"
  }
  ```

### `GET /api/alerts`
- **Description:** Retrieve active, acknowledged, and resolved clinical alarms.

### `GET /api/audit`
- **Description:** Fetch SHA-256 tamper-evident cryptographic audit ledger.

### `GET /api/scenarios`
- **Description:** Retrieve 8 canonical electrophysiology scenarios with benchmark results.
