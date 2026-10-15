# Security Policy & Research Boundaries

## 1. Safety & Operational Boundary

> [!IMPORTANT]
> **HealthHeart™ / LeadlessGuard™ is an engineering simulation platform for digital health research, signal visualization, and cybersecurity analysis.**
> 
> - **No Real Implant Connection:** This repository contains no code, physical BLE profiles, or clinical programmer commands capable of pacing a human heart or modifying physical implant settings.
> - **Simulation Only:** Pacing logic (VVI/VVIR) and signal streams are simulated mathematical models intended for educational, academic, and software verification purposes.
> - **Not a Medical Device:** HealthHeart is not approved or certified by FDA, CE, or any regulatory body for clinical diagnostic or therapeutic use.

---

## 2. Supported Versions

Security updates and vulnerability patches are maintained for the latest release:

| Version | Supported |
| :--- | :--- |
| `1.x.x` (current) | :white_check_mark: |
| `< 1.0.0` | :x: |

---

## 3. Reporting a Vulnerability

We prioritize the security of research data and the demonstration of cryptographic safety patterns. If you discover a security vulnerability (such as an unintentional secret exposure, flawed cryptographic verification in telemetry replay protection, or backend injection flaw), please report it responsibly:

1. **Do not create a public GitHub issue.**
2. Send an email to the repository maintainers or use GitHub's private vulnerability reporting feature.
3. Include:
   - Detailed description of the potential vulnerability.
   - Steps to reproduce or proof-of-concept payload.
   - Recommended remediation or patch (if known).
4. Maintainers will acknowledge receipt within 48 hours and coordinate remediation before public disclosure.

---

## 4. Cybersecurity Research & STRIDE Scenarios

HealthHeart contains an interactive **Cybersecurity Center** modeled after STRIDE threat categories:
- Spoofing (unauthorized telemetry packets)
- Tampering (modified payload parameters)
- Repudiation (tampered audit logs)
- Information Disclosure (unencrypted BLE broadcast)
- Denial of Service (RF/BLE battery depletion storm)
- Elevation of Privilege (unauthorized diagnostic command injection)

All cyber-attacks demonstrated in this platform are executed against **synthetic simulated states** to educate software engineers and biomedical researchers on defensive cryptographic designs.
