# HealthHeart™ | LeadlessGuard™ Telemetry Architecture Document
**Classification:** `MONITORING` / `SECURITY` / `SIMULATION`

---

## 1. Mock Bluetooth Low Energy (BLE 5.3) Framing

```
+-----------------------------------------------------------------------------------+
|                           BLE 5.3 AES-GCM Telemetry Packet                        |
+---------------------+-------------------+------------------+----------------------+
|  Preamble (2 Bytes) | Session ID (8 B)  | Sequence Counter | Timestamp UTC (8 B)  |
|      0xAA 0x55      | SES-8821-AES256   | Monotonic uint32 | Epoch Microseconds   |
+---------------------+-------------------+------------------+----------------------+
|  Payload Type (1 B) | Payload Len (2 B) | Encrypted Vitals | Auth Tag (16 Bytes)  |
| 0x01 (ECG/PPG/Vitals)|   Variable (128B) | Ciphertext Bytes | AES-GCM-256 MAC      |
+---------------------+-------------------+------------------+----------------------+
```

---

## 2. Replay Protection & Session Validation
- **Sequence Verification:** Every incoming packet must possess `SequenceNumber > LastObservedSequence`. Packets with equal or lower sequence numbers are immediately dropped with a `REPLAY_ATTACK_DETECTED` security audit entry.
- **Timestamp Freshness:** Telemetry packets older than $5000\text{ ms}$ relative to host system time are rejected with `PACKET_EXPIRED`.
- **Forward Secrecy:** Session keys are derived via simulated ECDH (Elliptic Curve Diffie-Hellman on curve `secp256r1`) combined with HKDF-SHA256 key expansion.
