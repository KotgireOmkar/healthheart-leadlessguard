# HealthHeart™ | LeadlessGuard™ STRIDE Threat Model
**Classification:** `SECURITY` / `RESEARCH ONLY`

---

## 1. 10-Threat Analysis Matrix

| # | Threat Category | STRIDE Class | Attack Vector | Mitigation in Code | Test Case ID |
|---|---|---|---|---|---|
| **1** | Eavesdropping | Information Disclosure | Passive radio packet sniffing | AES-GCM-256 payload encryption | `SEC-01` |
| **2** | Rogue Pairing | Spoofing | Unauthenticated BLE pairing | Mandatory OOB token & QR verification | `SEC-02` |
| **3** | Replay Attack | Tampering | Ingestion of stale sequence frames | Monotonic counters & 5000ms timestamp expiry | `SEC-03` |
| **4** | BLE Flood (DoS) | Denial of Service | Flooding radio with 500 req/sec | Hardware duty-cycle governor & rate limiter | `SEC-04` |
| **5** | Malformed Packet | Tampering | Fuzzed, truncated JSON payloads | Strict schema validation with safe exception handling | `SEC-05` |
| **6** | Buffer Overrun | Elevation of Privilege | Memory boundary overflow injection | Memory-safe TypeScript data modeling | `SEC-06` |
| **7** | Key Compromise | Spoofing | Forged session token injection | Forward secrecy via HKDF rolling keys | `SEC-07` |
| **8** | Unauthorized Reprogram | Tampering | Direct write to LRL parameter | Three-Domain boundary & Approval Gate | `SEC-08` |
| **9** | Gateway Impersonation | Spoofing | Spoofed device serial number | Mutual cryptographic certificate handshake | `SEC-09` |
| **10**| Firmware Tampering | Tampering | Unsigned OTA update injection | Dual ECDSA signature validation | `SEC-10` |
