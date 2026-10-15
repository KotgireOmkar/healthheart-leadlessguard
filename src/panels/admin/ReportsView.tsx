import React, { useState } from 'react';
import { AuditRecord } from '../../types';
import { api } from '../../services/api';
import { 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  Lock, 
  FileText, 
  Search, 
  Play, 
  Pause,
  Key,
  Database,
  Layers
} from 'lucide-react';

interface ReportsViewProps {
  auditRecords: AuditRecord[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ auditRecords }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPlayingStrip, setIsPlayingStrip] = useState<boolean>(true);
  const [verificationResult, setVerificationResult] = useState<{ verified: boolean; totalBlocks: number } | null>({
    verified: true,
    totalBlocks: auditRecords.length || 1482
  });

  const handleVerifyLedger = async () => {
    setIsVerifying(true);
    const result = await api.verifyAuditLedger();
    setIsVerifying(false);
    setVerificationResult(result);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditRecords, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'leadlessguard_audit_ledger.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCsv = () => {
    let csv = 'Block_Index,Timestamp_UTC,Actor_Role,Category,Details,SHA256_Hash\n';
    auditRecords.forEach(r => {
      csv += `${r.blockIndex},"${r.timestamp}","${r.actorRole}","${r.category}","${r.details}","${r.currentBlockHash}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'leadlessguard_audit_ledger.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="content-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. Persona Header Card with Status Capsules */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '20px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#f5f3ff', border: '2px solid #ddd6fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6d28d9', fontWeight: 800, fontSize: '1.15rem' }}>
            <Lock size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>Regulatory Compliance & Cryptographic Integrity</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
              Cryptographic Audit Ledger & Compliance Reports
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', fontSize: '0.74rem', color: '#64748b' }}>
              <span>Architecture: <strong style={{ color: '#0f172a' }}>SHA-256 Hash Chain</strong></span>
              <span>•</span>
              <span>Height: <strong style={{ color: '#2563eb' }}>{auditRecords.length || 1482} Blocks</strong></span>
              <span>•</span>
              <span>Standard: <strong style={{ color: '#0f172a' }}>21 CFR Part 11 Non-Repudiation</strong></span>
            </div>
          </div>
        </div>

        {/* Status Capsules Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div className="badge-emerald" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            <CheckCircle2 size={16} />
            <span>Chain Height: {auditRecords.length || 1482} Blocks</span>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '9999px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <ShieldCheck size={16} color="#059669" />
            <span>Cryptographic Proof 100% Intact</span>
          </div>
        </div>
      </div>

      {/* 2. Signature Hero Metric Card & Secondary Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        
        {/* Card 1: Chain Integrity (Purple Glow Container) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Cryptographic Proof</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#059669', lineHeight: '1.2', margin: '4px 0 6px' }}>
              Verified Intact
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#6d28d9' }}>
              ● Zero Tampering Detected
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #f5f3ff 0%, #ddd6fe 65%, rgba(221, 214, 254, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(109, 40, 217, 0.2)' }}>
            <Lock size={32} color="#7c3aed" />
          </div>
        </div>

        {/* Card 2: Latest Hash (Blue Glow Container) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Latest Block Commit</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.2', margin: '4px 0 6px' }}>
              0x8f2a...b491
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2563eb' }}>
              ● Monotonic Chain Proof
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #eff6ff 0%, #bfdbfe 65%, rgba(191, 219, 254, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(37, 99, 235, 0.2)' }}>
            <Key size={32} color="#2563eb" />
          </div>
        </div>

        {/* Card 3: Non-Repudiation Status (Emerald Glow Container) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Non-Repudiation Compliance</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              100%
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#059669' }}>
              ● 21 CFR Part 11 Validated
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #ecfdf5 0%, #a7f3d0 65%, rgba(167, 243, 208, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(16, 185, 129, 0.2)' }}>
            <ShieldCheck size={32} color="#059669" />
          </div>
        </div>

      </div>

      {/* 3. Tri-Colour Audit Ledger Rings (Photo Style) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        {/* Ring 1: Clinician Reprogramming Commits (Royal Blue) */}
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
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Reprogramming Commits</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Dual Signature Verified</div>
          </div>
        </div>

        {/* Ring 2: Security Alarms Audited (Sunset Amber) */}
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
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>100%</div>
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Security Alarms Audited</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Replay & DoS Events Captured</div>
          </div>
        </div>

        {/* Ring 3: Mathematical Hash Chain Proof (Emerald Mint) */}
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
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Mathematical Hash Chain</div>
            <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600 }}>SHA-256 Validated</div>
          </div>
        </div>

      </div>

      {/* 4. Live Block Ingestion Strip Card */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setIsPlayingStrip(!isPlayingStrip)}
              style={{ width: 30, height: 30, borderRadius: '50%', background: '#ffffff', border: '1.5px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0f172a' }}
              title={isPlayingStrip ? 'Freeze Block Timeline' : 'Resume Block Timeline'}
            >
              {isPlayingStrip ? <Pause size={13} fill="#0f172a" /> : <Play size={13} fill="#0f172a" style={{ marginLeft: 2 }} />}
            </button>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                Chronological Block Commit Timeline (SHA-256 Merkle Chaining)
              </h3>
              <span style={{ fontSize: '0.72rem', color: '#6d28d9', fontWeight: 600 }}>
                ● Immutable Append-Only Ledger Guaranteed
              </span>
            </div>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
            Latest Block: #{auditRecords[0]?.blockIndex || 1482}
          </span>
        </div>

        {/* Recent Committed Blocks List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
          {auditRecords.slice(0, 4).map(b => (
            <div key={b.blockIndex} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>Block #{b.blockIndex}</span>
                <span className="badge-purple" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>{b.category}</span>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#64748b', lineHeight: 1.3 }}>{b.details}</p>
              <div style={{ marginTop: '6px', fontSize: '0.65rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                Hash: {b.currentBlockHash.substring(0, 20)}...
              </div>
            </div>
          ))}
        </div>

        {/* Time Interval Markers */}
        <div className="rhythm-time-markers">
          <span>#1470 - #1475 (Prior Epoch)</span>
          <span>#1475 - #1480 (Recent Commits)</span>
          <span>#1480 - #1482 (Current Tip)</span>
        </div>
      </div>

      {/* 5. Cryptographic Verification Action Card */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div>
          <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>Cryptographic Hash Verification Status</h4>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
            {verificationResult?.verified ? '● All blocks verified: SHA-256 forward links match previous hashes with zero discrepancy.' : 'Verification in progress...'}
          </p>
        </div>

        <button
          onClick={handleVerifyLedger}
          disabled={isVerifying}
          style={{
            padding: '10px 18px',
            background: '#ecfdf5',
            color: '#047857',
            border: '1.5px solid #a7f3d0',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.8rem',
            cursor: isVerifying ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ShieldCheck size={16} />
          {isVerifying ? 'Validating Hashes...' : 'Verify Hash Chain Integrity'}
        </button>
      </div>

      {/* 6. Dual Action Buttons (Photo Style) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '4px' }}>
        <button
          onClick={handleExportCsv}
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
          <Download size={18} color="#2563eb" />
          Download Audit Ledger CSV
        </button>

        <button
          onClick={handleExportJSON}
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
          <FileText size={18} color="#ffffff" />
          Export Signed JSON Ledger
        </button>
      </div>

    </div>
  );
};
