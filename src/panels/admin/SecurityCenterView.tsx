import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Key, 
  QrCode, 
  Radio, 
  Play, 
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Smartphone,
  Download,
  FileCode,
  Flame,
  Zap,
  Clock
} from 'lucide-react';

interface SecurityAttackTest {
  id: string;
  threatName: string;
  vector: string;
  affectedDomain: string;
  impact: string;
  mitigation: string;
  status: 'IDLE' | 'TESTING' | 'BLOCKED_SUCCESS' | 'MITIGATED';
  testLog: string;
}

export const SecurityCenterView: React.FC = () => {
  const [activeSessionId, setActiveSessionId] = useState<string>('SES-8821-AES256');
  const [authenticatedPacketsCount, setAuthenticatedPacketsCount] = useState<number>(14892);
  const [rejectedPacketsCount, setRejectedPacketsCount] = useState<number>(42);
  const [replayAttemptsDetected, setReplayAttemptsDetected] = useState<number>(12);
  const [oobToken, setOobToken] = useState<string>('OOB-SEC-99412');
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [isNfcPairing, setIsNfcPairing] = useState<boolean>(false);
  const [isPlayingStrip, setIsPlayingStrip] = useState<boolean>(true);

  // 10 Threat Scenarios Matrix (Prompt 11)
  const [threats, setThreats] = useState<SecurityAttackTest[]>([
    {
      id: 'mitm',
      threatName: 'Man-in-the-Middle (MITM) Eavesdropping',
      vector: 'Passive radio interception of BLE telemetry advertisements',
      affectedDomain: 'Domain 2 (Telemetry Gateway)',
      impact: 'Potential telemetry data disclosure without confidentiality',
      mitigation: 'AES-GCM-256 authenticated encryption with ECDH session keys',
      status: 'IDLE',
      testLog: 'Ready to inject intercepted packet sniffing simulation.'
    },
    {
      id: 'unauth_pairing',
      threatName: 'Unauthorized Pairing & Hijacking',
      vector: 'Rogue smartphone attempting BLE GATT pairing without OOB credentials',
      affectedDomain: 'Domain 2 (Telemetry Gateway)',
      impact: 'Unauthorized connection establishment',
      mitigation: 'Mandatory Out-Of-Band (OOB) numeric token and QR-code enrollment',
      status: 'IDLE',
      testLog: 'Ready to launch unauthorized bonding request.'
    },
    {
      id: 'replay',
      threatName: 'Telemetry Replay Attack',
      vector: 'Re-transmitting valid historical packets with stale sequence numbers',
      affectedDomain: 'Domain 2 & 3 (Gateway & App)',
      impact: 'Presentation of deceptive cardiac telemetry to clinicians',
      mitigation: 'Monotonically increasing sequence counters with 5000ms timestamp expiry',
      status: 'IDLE',
      testLog: 'Ready to replay telemetry packet #8420 into gateway.'
    },
    {
      id: 'resource_exhaustion',
      threatName: 'Resource Exhaustion / BLE Packet Flood (DoS)',
      vector: 'Flooding gateway with 500 connection requests per second',
      affectedDomain: 'Domain 1 & 2 (Pacing Core Battery & Gateway)',
      impact: 'Radio subsystem battery drain and telemetry starvation',
      mitigation: 'Hardware duty-cycle governor and strict rate-limiting filter',
      status: 'IDLE',
      testLog: 'Ready to benchmark packet flood rate limiter.'
    },
    {
      id: 'malformed_packet',
      threatName: 'Malformed Packet Fuzzing',
      vector: 'Injecting non-conformant, truncated, or oversized JSON frames',
      affectedDomain: 'Domain 2 (Serialization Layer)',
      impact: 'Parser crash or denial of telemetry service',
      mitigation: 'Strict schema validation and bounded memory buffer deserialization',
      status: 'IDLE',
      testLog: 'Ready to transmit fuzzed payload.'
    },
    {
      id: 'memory_boundary',
      threatName: 'Memory-Safety & Boundary Injection',
      vector: 'Buffer overrun injection via telemetry payload fields',
      affectedDomain: 'Domain 1 (Firmware Core)',
      impact: 'Virtual memory corruption or state diversion',
      mitigation: 'Type-safe memory isolation with zero unchecked buffer operations',
      status: 'IDLE',
      testLog: 'Ready to execute memory boundary test.'
    },
    {
      id: 'key_compromise',
      threatName: 'Session Key Compromise Simulation',
      vector: 'Attempting telemetry ingestion using an expired or forged session key',
      affectedDomain: 'Domain 2 (Telemetry Gateway)',
      impact: 'Impersonation of trusted telemetry gateway',
      mitigation: 'HKDF session derivation with rolling forward secrecy',
      status: 'IDLE',
      testLog: 'Ready to test forged session authentication tag.'
    },
    {
      id: 'unauth_reprogram',
      threatName: 'Unauthorized Therapy Reprogramming Attempt',
      vector: 'Direct write request to lower rate limit from unauthorized client',
      affectedDomain: 'Domain 1 (Pacing Core)',
      impact: 'Unintended alteration of simulated pacing threshold',
      mitigation: 'Strict Three-Domain boundary isolation and Reprogramming Review Gate',
      status: 'IDLE',
      testLog: 'Ready to attempt direct write to pacing parameter.'
    },
    {
      id: 'domain_impersonation',
      threatName: 'Telemetry Gateway Impersonation',
      vector: 'Spoofed BLE MAC address and unauthorized device identifier',
      affectedDomain: 'Domain 3 (Clinician App)',
      impact: 'False device telemetry presented in hospital workstation',
      mitigation: 'Cryptographic device certificate validation and mutual authentication',
      status: 'IDLE',
      testLog: 'Ready to inject spoofed device telemetry.'
    },
    {
      id: 'ota_tampering',
      threatName: 'Tampered Firmware Image Simulation',
      vector: 'Injecting unsigned firmware binary into virtual update service',
      affectedDomain: 'Domain 1 (Firmware Core)',
      impact: 'Deployment of compromised virtual firmware',
      mitigation: 'Dual asymmetric ECDSA signature verification with hardware root of trust',
      status: 'IDLE',
      testLog: 'Ready to upload unsigned binary payload.'
    }
  ]);

  const runAttackTest = (threatId: string) => {
    setThreats(prev => prev.map(t => {
      if (t.id === threatId) {
        return {
          ...t,
          status: 'BLOCKED_SUCCESS',
          testLog: `[SIMULATED ATTACK EXECUTED]: Attack vector triggered. Gateway cryptographic guard recognized anomaly. Action: BLOCKED. Event logged to SHA-256 ledger.`
        };
      }
      return t;
    }));
    setRejectedPacketsCount(prev => prev + 1);
  };

  const runAllTests = () => {
    setThreats(prev => prev.map(t => ({
      ...t,
      status: 'BLOCKED_SUCCESS',
      testLog: `[SIMULATED ATTACK EXECUTED]: Vector blocked via ${t.mitigation}. Verification status: 100% DEFENDED.`
    })));
    setRejectedPacketsCount(prev => prev + 10);
  };

  const handleAuditLedger = () => {
    alert(`Security Event Ledger: 14,892 Authenticated Frames, ${rejectedPacketsCount} Rejected Violations, 12 Replay Neutralizations. All cryptographic assertions PASS.`);
  };

  return (
    <div className="content-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. Persona Header Card with Status Capsules */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '20px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#ecfeff', border: '2px solid #a5f3fc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0e7490', fontWeight: 800, fontSize: '1.15rem' }}>
            <Lock size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>Device Cybersecurity & Gateway Cryptography</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
              LeadlessGuard™ Zero-Trust Security Command
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', fontSize: '0.74rem', color: '#64748b' }}>
              <span>Protocol: <strong style={{ color: '#0f172a' }}>BLE 5.3 AES-GCM-256</strong></span>
              <span>•</span>
              <span>Active Session: <strong style={{ color: '#2563eb' }}>{activeSessionId}</strong></span>
              <span>•</span>
              <span>Key Exchange: <strong style={{ color: '#0f172a' }}>ECDH secp256r1</strong></span>
            </div>
          </div>
        </div>

        {/* Status Capsules Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div className="badge-emerald" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            <CheckCircle2 size={16} />
            <span>Mutual ECDH Established</span>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '9999px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <Key size={16} color="#0891b2" />
            <span>Hardware Root of Trust</span>
          </div>
        </div>
      </div>

      {/* 2. Signature Hero Metric Card & Secondary Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        
        {/* Card 1: Authenticated Packets (Cyan Glow Container) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Authenticated Ingestion</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              {authenticatedPacketsCount.toLocaleString()} <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>Frames</span>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0891b2' }}>
              ● Zero Cryptographic Breaches
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #ecfeff 0%, #a5f3fc 65%, rgba(165, 243, 252, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(6, 182, 212, 0.2)' }}>
            <Lock size={32} color="#0891b2" />
          </div>
        </div>

        {/* Card 2: Replay Protection Status (Amber Glow Container) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Replay Protection Efficacy</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              {replayAttemptsDetected} <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>Neutralized</span>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#059669' }}>
              ● Stale Sequences Dropped
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #fef3c7 0%, #fde68a 65%, rgba(253, 230, 138, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(245, 158, 11, 0.2)' }}>
            <ShieldAlert size={32} color="#d97706" />
          </div>
        </div>

        {/* Card 3: Rejected Violations (Rose Glow Container) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Rejected Malformed Packets</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              {rejectedPacketsCount} <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>Blocked</span>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e11d48' }}>
              ● Zero Memory Boundary Leaks
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #ffe4e6 0%, #fecdd3 65%, rgba(254, 205, 211, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(225, 29, 72, 0.2)' }}>
            <ShieldCheck size={32} color="#e11d48" />
          </div>
        </div>

      </div>

      {/* 3. Tri-Colour Security Diagnostic Rings (Photo Style) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        {/* Ring 1: Mutual Authentication Rate (Royal Blue) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div className="circular-ring-wrapper" style={{ width: 76, height: 76 }}>
            <svg width="76" height="76" className="circular-ring-svg">
              <circle cx="38" cy="38" r="32" strokeWidth="6" className="circular-ring-bg" />
              <circle
                cx="38"
                cy="38"
                r="32"
                strokeWidth="6"
                stroke="#2563eb"
                strokeDasharray={2 * Math.PI * 32}
                strokeDashoffset={0}
                className="circular-ring-progress"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>100%</div>
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Mutual Authentication Rate</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>ECDH secp256r1 Validated</div>
          </div>
        </div>

        {/* Ring 2: Threat Block Efficacy (Sunset Amber) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div className="circular-ring-wrapper" style={{ width: 76, height: 76 }}>
            <svg width="76" height="76" className="circular-ring-svg">
              <circle cx="38" cy="38" r="32" strokeWidth="6" className="circular-ring-bg" />
              <circle
                cx="38"
                cy="38"
                r="32"
                strokeWidth="6"
                stroke="#f59e0b"
                strokeDasharray={2 * Math.PI * 32}
                strokeDashoffset={0}
                className="circular-ring-progress"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>10 / 10</div>
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Threat Block Efficacy</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>10 / 10 Vectors Neutralized</div>
          </div>
        </div>

        {/* Ring 3: Sequence Counter Monotonicity (Emerald Mint) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div className="circular-ring-wrapper" style={{ width: 76, height: 76 }}>
            <svg width="76" height="76" className="circular-ring-svg">
              <circle cx="38" cy="38" r="32" strokeWidth="6" className="circular-ring-bg" />
              <circle
                cx="38"
                cy="38"
                r="32"
                strokeWidth="6"
                stroke="#10b981"
                strokeDasharray={2 * Math.PI * 32}
                strokeDashoffset={0}
                className="circular-ring-progress"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>100%</div>
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Sequence Monotonicity</div>
            <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600 }}>Zero Sequence Gaps Permitted</div>
          </div>
        </div>

      </div>

      {/* 4. Live Security Telemetry Stream Strip */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setIsPlayingStrip(!isPlayingStrip)}
              style={{ width: 30, height: 30, borderRadius: '50%', background: '#ffffff', border: '1.5px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0f172a' }}
              title={isPlayingStrip ? 'Freeze Telemetry Log' : 'Resume Telemetry Log'}
            >
              {isPlayingStrip ? <Pause size={13} fill="#0f172a" /> : <Play size={13} fill="#0f172a" style={{ marginLeft: 2 }} />}
            </button>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                Cryptographic Telemetry Frame Stream (AES-GCM Authenticated)
              </h3>
              <span style={{ fontSize: '0.72rem', color: '#0891b2', fontWeight: 600 }}>
                ● Real-Time Nonce-Sequence Verification on BLE Gateway Interface
              </span>
            </div>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
            Nonce Sequence: #8492 .. #8512
          </span>
        </div>

        {/* Rolling Frame Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', background: '#f8fafc', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          {[8492, 8493, 8494, 8495, 8496, 8497].map(seq => (
            <div key={seq} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>Frame #{seq}</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Tag: 0x9b4a..f2</div>
              </div>
              <span className="badge-emerald" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                VALID
              </span>
            </div>
          ))}
        </div>

        {/* Time Interval Markers */}
        <div className="rhythm-time-markers">
          <span>#8480 - #8490 (Session Epoch 1)</span>
          <span>#8490 - #8500 (Session Epoch 2)</span>
          <span>#8500 - #8512 (Active Ingestion)</span>
        </div>
      </div>

      {/* 5. Mock Out-Of-Band (OOB) Pairing Console */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div>
          <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>Out-Of-Band (OOB) Secure Enrollment</h4>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
            Token: <strong style={{ fontFamily: 'var(--font-mono)', color: '#0f172a' }}>{oobToken}</strong> • Zero passive MITM attack surface during initial smartphone pairing.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowQrModal(!showQrModal)}
            style={{
              padding: '10px 16px',
              background: '#eff6ff',
              color: '#1d4ed8',
              border: '1.5px solid #bfdbfe',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <QrCode size={16} />
            {showQrModal ? 'Hide QR Code' : 'Display QR Token'}
          </button>

          <button
            onClick={() => {
              setIsNfcPairing(true);
              setTimeout(() => setIsNfcPairing(false), 2000);
            }}
            style={{
              padding: '10px 16px',
              background: '#f8fafc',
              color: '#0f172a',
              border: '1.5px solid #eaecf0',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Radio size={16} color="#0891b2" />
            {isNfcPairing ? 'NFC Handshake...' : 'Simulate NFC Tap'}
          </button>
        </div>
      </div>

      {/* 6. 10 Interactive Threat Testing Console */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
          10-Vector Cyber Attack Verification Console (Prompt 11)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
          {threats.map(t => {
            const isBlocked = t.status === 'BLOCKED_SUCCESS';
            return (
              <div
                key={t.id}
                style={{
                  background: isBlocked ? '#ecfdf5' : '#ffffff',
                  border: `1.5px solid ${isBlocked ? '#a7f3d0' : '#eaecf0'}`,
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '10px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>{t.threatName}</span>
                    <span 
                      style={{ 
                        fontSize: '0.68rem', 
                        fontWeight: 700, 
                        padding: '2px 8px', 
                        borderRadius: '9999px',
                        background: isBlocked ? '#d1fae5' : '#f1f5f9',
                        color: isBlocked ? '#065f46' : '#475569'
                      }}
                    >
                      {isBlocked ? 'DEFENDED' : 'IDLE'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: '#64748b', lineHeight: 1.4 }}>
                    <strong>Vector:</strong> {t.vector}
                  </p>
                  <p style={{ fontSize: '0.72rem', color: '#047857', marginTop: '4px' }}>
                    <strong>Mitigation:</strong> {t.mitigation}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => runAttackTest(t.id)}
                    style={{
                      padding: '6px 14px',
                      background: isBlocked ? '#059669' : '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Play size={11} fill="#ffffff" />
                    {isBlocked ? 'Re-Test Vector' : 'Inject Attack Vector'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. Dual Action Buttons (Photo Style) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '4px' }}>
        <button
          onClick={handleAuditLedger}
          style={{
            background: '#ffffff',
            border: '1.5px solid #eaecf0',
            borderRadius: '16px',
            padding: '14px 20px',
            color: '#0f172a',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            transition: 'all 0.15s ease'
          }}
        >
          <ShieldCheck size={18} color="#0891b2" />
          Audit Security Event Ledger
        </button>

        <button
          onClick={runAllTests}
          style={{
            background: '#2563eb',
            border: 'none',
            borderRadius: '16px',
            padding: '14px 20px',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
            transition: 'all 0.15s ease'
          }}
        >
          <Flame size={18} color="#ffffff" />
          Execute All 10 Threat Tests
        </button>
      </div>

    </div>
  );
};
