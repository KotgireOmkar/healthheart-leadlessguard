# HealthHeart™ | LeadlessGuard™ System Architecture Document
**Classification:** `SIMULATION` / `MONITORING` / `RESEARCH ONLY`

---

## 1. Executive Summary & Purpose
HealthHeart™ / LeadlessGuard™ is an enterprise-grade cardiac telemetry and electrophysiology research platform modeling a smartphone-integrated intelligent leadless pacemaker. 

> **Important Safety Boundary:**
> This system is an engineering simulation platform for digital health research, cybersecurity analysis, and electrophysiological concept demonstration. It contains **no real therapeutic device commands, implant firmware, clinical programmer protocols, or physical BLE characteristics capable of pacing a human heart**. Real implanted pacemaker programming is outside the scope of this prototype.

---

## 2. End-to-End System Architecture

```mermaid
graph TD
    subgraph "Domain 1: Leadless Pacemaker Core (Embedded Emulation)"
        FW["Virtual Firmware Engine\n(Model: LeadlessGuard VR-Pro | FW: v3.4.1)"]
        SENSE["Ventricular Sense Amplifier\n(Sensitivity: 1.5 mV | Refractory: 250 ms)"]
        VVI["VVI / VVIR Pacing Logic\n(LRL Threshold: 60 BPM / 1000 ms)"]
        DIAG["Device Diagnostics\n(Li/CFx 240 mAh | Impedance: 580Ω | Temp: 37.1°C)"]
    end

    subgraph "Domain 2: Telemetry Gateway (Simulated BLE 5.3)"
        PACKET["Telemetry Packet Serialization\n(ECG, PPG, SpO2, BIA, Diagnostics)"]
        CRYPTO["Cryptographic Pipeline\n(ECDH Key Derivation | AES-GCM-256)"]
        REPLAY["Replay Protection Filter\n(Monotonic Counters | 5000ms Expiry Window)"]
        GATE["Strict Read-Only Enforcement\n(Rejects Direct Therapy Modification)"]
    end

    subgraph "Domain 3: Enterprise Application Layer"
        ADMIN["Clinician EP Workstation\n(Multi-Patient Tabs: PAT-001 to PAT-005)"]
        PATIENT["Patient Companion Mobile App\n(Calming Multi-Colour UX | Emergency Hotline)"]
        SIGNALS["Synchronized 4-Track Oscilloscope\n(ECG with Calipers, PPG, SpO2, BIA)"]
        IMPULSE["5-Step Cardiac Impulse Visualizer\n(Intrinsic → Sense → Decision → Pulse → Evoked)"]
        AI["AI Rhythm Analytics Layer\n(HeartGPT Transformers | 9 Pattern Classes)"]
        SEC["Cybersecurity Center\n(Interactive 10-Threat Attack Console)"]
        POWER["Battery Duty-Cycle Model\n(Sleep, Sense, Pace, Radio Bursts)"]
        TESTS["Verification Suite\n(25+ Automated Tests: PASS/FAIL/BLOCKED)"]
    end

    subgraph "Persistence Layer"
        ATLAS[("MongoDB Atlas Cloud Database\n(Patients, Telemetry, Alerts, Audit Ledger)")]
    end

    FW --> SENSE
    SENSE --> VVI
    VVI --> DIAG
    DIAG --> PACKET
    PACKET --> CRYPTO
    CRYPTO --> REPLAY
    REPLAY --> GATE
    GATE -->|Encrypted Read-Only Stream| ADMIN
    GATE -->|Encrypted Read-Only Stream| PATIENT
    GATE -->|Encrypted Read-Only Stream| SIGNALS
    GATE -->|Encrypted Read-Only Stream| AI
    ADMIN -.->|Reprogramming Review Gate| ATLAS
```

---

## 3. High-Level Subsystem Specifications

| Subsystem | Functional Scope | Primary Technology |
| :--- | :--- | :--- |
| **Leadless Pacemaker Core** | Deterministic VVI/VVIR pacing threshold mathematics, escape interval calculation, intrinsic sensing blanking, battery discharge estimation. | TypeScript / Deterministic Mathematical Models |
| **Telemetry Gateway** | Read-only packet serialization, BLE 5.3 GATT framing emulation, simulated ECDH key exchange, HKDF session keys, AES-GCM-256 authenticated encryption. | TypeScript / Node.js Express Gateway |
| **Clinician EP Command Workstation** | 12 operational views, 5-patient tab switching, calibrated HTML5 Canvas ECG ($25\text{ mm/s}, 10\text{ mm/mV}$), digital calipers, alert lifecycle. | React 18 / TypeScript / Vite |
| **Patient Companion Mobile App** | Calming, reassuring patient interface, pulsing radial heart container, SpO2 quality badge, live pulse strip, tri-colour SVG activity rings, emergency call. | React 18 / SVG / CSS3 Animations |
| **Persistence Layer** | Secure cloud storage for patient baseline profiles, continuous telemetry frames, clinical alerts, and SHA-256 tamper-evident audit ledger. | MongoDB Atlas (`cluster0.sjdskjp.mongodb.net`) |
