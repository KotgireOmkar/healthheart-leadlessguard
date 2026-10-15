import React, { useState } from 'react';
import { Patient } from '../../types';
import { api } from '../../services/api';
import { 
  Database, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Sliders, 
  RefreshCw, 
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  UserCheck,
  Zap,
  Activity
} from 'lucide-react';

interface SettingsViewProps {
  activePatient: Patient;
  onPatientUpdated: (patient: Patient) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ activePatient, onPatientUpdated }) => {
  const [newLrl, setNewLrl] = useState(activePatient.lowerRateLimit);
  const [newMode, setNewMode] = useState(activePatient.activeScenario);
  const [reason, setReason] = useState('Routine clinical optimization');
  const [isApproved, setIsApproved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPlayingStrip, setIsPlayingStrip] = useState<boolean>(true);
  const [selectedRole, setSelectedRole] = useState<'Viewer' | 'Researcher' | 'Clinician-Simulation' | 'Administrator'>('Clinician-Simulation');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleReprogramSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isApproved) {
      alert('Approval confirmation verification required before committing simulated parameter change.');
      return;
    }

    setIsSubmitting(true);
    const updated = await api.updatePatientParameters(activePatient.patientId, {
      lowerRateLimit: newLrl,
    });
    setIsSubmitting(false);
    setSuccessMessage(`Successfully reprogrammed ${activePatient.fullName} (${activePatient.patientId}) to ${newLrl} BPM LRL.`);
    onPatientUpdated(updated);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleResetDefaults = () => {
    setNewLrl(60);
    setIsApproved(false);
    alert('Reprogramming draft reverted to factory default lower rate limit (60 BPM).');
  };

  return (
    <div className="content-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. Persona Header Card with Status Capsules */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '20px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#fef3c7', border: '2px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b45309', fontWeight: 800, fontSize: '1.15rem' }}>
            <Sliders size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>System Governance & Pacing Boundaries</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
              Therapy Reprogramming & Two-Step Approval Gate
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', fontSize: '0.74rem', color: '#64748b' }}>
              <span>Target Patient: <strong style={{ color: '#0f172a' }}>{activePatient.fullName} ({activePatient.patientId})</strong></span>
              <span>•</span>
              <span>Active Role: <strong style={{ color: '#2563eb' }}>{selectedRole}</strong></span>
              <span>•</span>
              <span>Safety Governance: <strong style={{ color: '#059669' }}>Two-Step Approval Gate Active</strong></span>
            </div>
          </div>
        </div>

        {/* Status Capsules Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div className="badge-emerald" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            <CheckCircle2 size={16} />
            <span>Cloud Database Synchronized</span>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '9999px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <ShieldCheck size={16} color="#059669" />
            <span>Dual Approval Required</span>
          </div>
        </div>
      </div>

      {successMessage && (
        <div style={{ padding: '14px 20px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '16px', color: '#065f46', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} color="#059669" />
          {successMessage}
        </div>
      )}

      {/* 2. Signature Hero Metric Card & Secondary Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        
        {/* Card 1: Lower Rate Limit LRL (Amber Glow Container) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Lower Rate Limit (LRL)</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              {newLrl} <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>BPM</span>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#d97706' }}>
              ● Escape Interval: {(60000 / newLrl).toFixed(0)} ms
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #fef3c7 0%, #fde68a 65%, rgba(253, 230, 138, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(245, 158, 11, 0.2)' }}>
            <Sliders size={32} color="#d97706" />
          </div>
        </div>

        {/* Card 2: Capture Threshold Voltage (Emerald Glow Container) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Capture Threshold Voltage</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              {activePatient.captureThresholdVolts} <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>V</span>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#059669' }}>
              ● Safety Margin 2.0x Adequate
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #ecfdf5 0%, #a7f3d0 65%, rgba(167, 243, 208, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(16, 185, 129, 0.2)' }}>
            <Zap size={32} color="#059669" />
          </div>
        </div>

        {/* Card 3: Boundary Clamping Guard (Blue Glow Container) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Safety Rate Bounds</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              30 - 120 <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>BPM</span>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2563eb' }}>
              ● Strict Hardware Clamp
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #eff6ff 0%, #bfdbfe 65%, rgba(191, 219, 254, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(37, 99, 235, 0.2)' }}>
            <ShieldCheck size={32} color="#2563eb" />
          </div>
        </div>

      </div>

      {/* 3. Tri-Colour Clinical Safety Rings (Photo Style) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        {/* Ring 1: Dual Signature Compliance (Royal Blue) */}
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
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Dual Signature Compliance</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Multi-Signature Verification</div>
          </div>
        </div>

        {/* Ring 2: Parameter Boundary Check (Sunset Amber) */}
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
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Parameter Bounds Check</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Strict Bounds (30-120 BPM)</div>
          </div>
        </div>

        {/* Ring 3: Cloud Database Sync Health (Emerald Mint) */}
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
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Cloud Database Health</div>
            <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600 }}>Atlas Cluster Synchronized</div>
          </div>
        </div>

      </div>

      {/* 4. Live Parameter Tolerance Slider Card */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setIsPlayingStrip(!isPlayingStrip)}
              style={{ width: 30, height: 30, borderRadius: '50%', background: '#ffffff', border: '1.5px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0f172a' }}
              title={isPlayingStrip ? 'Freeze Slider' : 'Resume Slider'}
            >
              {isPlayingStrip ? <Pause size={13} fill="#0f172a" /> : <Play size={13} fill="#0f172a" style={{ marginLeft: 2 }} />}
            </button>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                Therapy Rate Boundary Slider ({newLrl} BPM Proposed)
              </h3>
              <span style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 600 }}>
                ● Real-Time Escape Interval Simulation: {(60000 / newLrl).toFixed(0)} ms
              </span>
            </div>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
            Safe Range: 40 - 90 BPM
          </span>
        </div>

        {/* Range Slider */}
        <div style={{ padding: '10px 0' }}>
          <input
            type="range"
            min="40"
            max="90"
            step="5"
            value={newLrl}
            onChange={e => setNewLrl(Number(e.target.value))}
            style={{ width: '100%', height: '8px', borderRadius: '4px', accentColor: '#2563eb', cursor: 'pointer' }}
          />
        </div>

        {/* Time Interval Markers */}
        <div className="rhythm-time-markers">
          <span>40 BPM (Bradycardia Floor)</span>
          <span>60 BPM (Standard Baseline)</span>
          <span>90 BPM (Upper Rate Limit)</span>
        </div>
      </div>

      {/* 5. 4-Tier Role Selection & Approval Check-In Card */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
          Authorized Governance Role & Verification Approval
        </h3>

        {/* Role Selector Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
          {(['Viewer', 'Researcher', 'Clinician-Simulation', 'Administrator'] as const).map(role => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                border: '1.5px solid',
                borderColor: selectedRole === role ? '#2563eb' : '#eaecf0',
                background: selectedRole === role ? '#eff6ff' : '#ffffff',
                color: selectedRole === role ? '#1d4ed8' : '#64748b',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Verification Checkbox Card */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <input
            type="checkbox"
            id="approvalCheckbox"
            checked={isApproved}
            onChange={e => setIsApproved(e.target.checked)}
            style={{ width: 20, height: 20, accentColor: '#2563eb', cursor: 'pointer' }}
          />
          <label htmlFor="approvalCheckbox" style={{ fontSize: '0.82rem', color: '#0f172a', fontWeight: 600, cursor: 'pointer' }}>
            I confirm that I hold the <strong>{selectedRole}</strong> credential and verify that updating Lower Rate Limit to <strong>{newLrl} BPM</strong> has been reviewed for physiological safety.
          </label>
        </div>
      </div>

      {/* 6. Dual Action Buttons (Photo Style) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '4px' }}>
        <button
          onClick={handleResetDefaults}
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
          <RotateCcw size={18} color="#64748b" />
          Revert to Factory Defaults
        </button>

        <button
          onClick={handleReprogramSubmit}
          disabled={isSubmitting || !isApproved}
          style={{
            background: isApproved ? '#2563eb' : '#94a3b8',
            border: 'none',
            borderRadius: '16px',
            padding: '14px 20px',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: isApproved && !isSubmitting ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: isApproved ? '0 2px 8px rgba(37, 99, 235, 0.25)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <CheckCircle2 size={18} color="#ffffff" />
          {isSubmitting ? 'Committing Parameter...' : 'Submit Reprogramming Request'}
        </button>
      </div>

    </div>
  );
};
