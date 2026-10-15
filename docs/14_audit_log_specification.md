# HealthHeart™ | LeadlessGuard™ Audit-Log Specification
**Classification:** `SECURITY` / `MONITORING`

---

## 1. Tamper-Evident SHA-256 Ledger
Every significant event (reprogramming request, alert acknowledgement, security attack detection) produces an append-only block:

$$H_i = \text{SHA-256}(H_{i-1} \parallel \text{Index}_i \parallel \text{Timestamp}_i \parallel \text{Actor}_i \parallel \text{Action}_i \parallel \text{Payload}_i)$$

- If any historical record is modified or deleted, the hash chain breaks from that block onward, providing tamper-evident mathematical verification.
