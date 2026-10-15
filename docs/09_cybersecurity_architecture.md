# HealthHeart™ | LeadlessGuard™ Cybersecurity Architecture Document
**Classification:** `SECURITY` / `SIMULATION`

---

## 1. Cryptographic Specifications

```
1. Key Agreement:        ECDH (Elliptic Curve Diffie-Hellman) on Curve secp256r1
2. Key Derivation:       HKDF-SHA256 (RFC 5869) with salt and info context
3. Authenticated Cipher: AES-256-GCM (128-bit Authentication Tag, 96-bit Nonce)
4. Audit Trail:          Append-only SHA-256 blockchain-style hash chain
5. Out-of-Band Channel:  Simulated NFC tap & alphanumeric enrollment token (OOB)
```

---

## 2. Security Defense Mechanics
- **Session Expiration:** Telemetry sessions expire automatically after 30 minutes of inactivity or upon sequence counter wrap-around.
- **Hardware Abstraction:** Cryptographic keys are isolated within a simulated secure hardware enclave abstraction.
