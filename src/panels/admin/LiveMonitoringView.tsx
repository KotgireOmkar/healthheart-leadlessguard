import React, { useState } from 'react';
import { Patient } from '../../types';
import { ECGCanvas } from '../../components/ECGCanvas';
import { simulator } from '../../services/signalGenerators';
import { CardiacImpulsePanel } from '../../components/CardiacImpulsePanel';
import { FaultInjectionPanel } from '../../components/FaultInjectionPanel';
import { 
  Activity, 
  ShieldCheck, 
  Zap, 
  Download, 
  FileJson, 
  Play, 
  Pause, 
  CheckCircle2, 
  Clock, 
  Waves,
  Heart,
  Droplets,
  Wind
} from 'lucide-react';

interface LiveMonitoringViewProps {
  patients: Patient[];
  activePatient: Patient;
  onSelectPatient: (patient: Patient) => void;
}

export const LiveMonitoringView: React.FC<LiveMonitoringViewProps> = ({
  patients,
  activePatient,
  onSelectPatient,
}) => {
  const [sweepSpeed, setSweepSpeed] = useState<'25' | '50'>('25');
  const [isPlayingStrip, setIsPlayingStrip] = useState<boolean>(true);

  simulator.setPatientParameters(
    activePatient.baselineHeartRate, 
    activePatient.pacingBurdenPercent,
    activePatient.patientId === 'PT-005' ? 0.08 : 0.02
  );
  const data = simulator.generateBuffer(12);

  const getPersonaAlias = (fullName: string, patientId: string) => {
    const parts = fullName.split(' ');
    if (parts.length > 1) {
      return parts[parts.length - 1].replace(/[^a-zA-Z0-9]/g, '');
    }
    const clean = patientId.replace(/[^a-zA-Z0-9]/g, '');
    return clean.slice(-3);
  };

  // Dynamic Export synthetic ECG as CSV
  const handleExportCsv = () => {
    let csv = 'Timestamp_Sec,ECG_mV,PPG_au,SpO2_pct,BIA_Ohms,Paced_Flag\n';
    data.forEach(pt => {
      csv += `${pt.time.toFixed(3)},${pt.ecg.toFixed(4)},${pt.ppg.toFixed(4)},${pt.spo2.toFixed(1)},${pt.bia.toFixed(1)},${pt.isPaced ? 1 : 0}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leadlessguard_${activePatient.patientId}_ecg_telemetry.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dynamic Export synthetic telemetry as JSON
  const handleExportJson = () => {
    const exportPayload = {
      patientId: activePatient.patientId,
      patientName: activePatient.fullName,
      deviceSerial: activePatient.serialNumber,
      lowerRateLimit: activePatient.lowerRateLimit,
      leadImpedanceOhms: activePatient.leadImpedanceOhms,
      exportedAt: new Date().toISOString(),
      sampleRateHz: 250,
      totalSamples: data.length,
      telemetryFrames: data
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leadlessguard_${activePatient.patientId}_telemetry.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="content-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. Patient Switcher Tabs */}
      <div className="patient-tabs-bar">
        {patients.map(p => (
          <button
            key={p.patientId}
            className={`patient-tab-btn ${activePatient.patientId === p.patientId ? 'active' : ''}`}
            onClick={() => onSelectPatient(p)}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.telemetryStatus === 'ONLINE' ? '#10b981' : '#f59e0b' }} />
            <div>
              <span className="tab-name" style={{ fontWeight: 800 }}>{p.fullName}</span>
            </div>
          </button>
        ))}
      </div>

      {/* 2. Persona Header Card (Photo Match Design) */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '20px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#ecfeff', border: '2px solid #a5f3fc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0e7490', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '0.5px' }}>
            <span>{getPersonaAlias(activePatient.fullName, activePatient.patientId)}</span>
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>Electrophysiology Live Telemetry</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
              {activePatient.fullName} <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#64748b' }}>({activePatient.patientId})</span>
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', fontSize: '0.74rem', color: '#64748b' }}>
              <span>Device: <strong style={{ color: '#0f172a' }}>{activePatient.deviceModel}</strong> ({activePatient.serialNumber})</span>
              <span>•</span>
              <span>Pacing Mode: <strong style={{ color: '#2563eb' }}>VVI Demand ({activePatient.lowerRateLimit} BPM)</strong></span>
            </div>
          </div>
        </div>

        {/* Status Capsules & Sweep Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div className="badge-emerald" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            <CheckCircle2 size={16} />
            <span>4 Channels Synchronized</span>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '9999px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <Clock size={16} color="#0284c7" />
            <span>0.0ms Uplink Latency</span>
          </div>

          <div style={{ display: 'flex', background: '#f8fafc', padding: '3px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <button
              onClick={() => setSweepSpeed('25')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: sweepSpeed === '25' ? '#ffffff' : 'transparent',
                color: sweepSpeed === '25' ? '#2563eb' : '#64748b',
                fontWeight: 700,
                fontSize: '0.75rem',
                cursor: 'pointer',
                boxShadow: sweepSpeed === '25' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              25 mm/s
            </button>
            <button
              onClick={() => setSweepSpeed('50')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: sweepSpeed === '50' ? '#ffffff' : 'transparent',
                color: sweepSpeed === '50' ? '#2563eb' : '#64748b',
                fontWeight: 700,
                fontSize: '0.75rem',
                cursor: 'pointer',
                boxShadow: sweepSpeed === '50' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              50 mm/s
            </button>
          </div>
        </div>
      </div>

      {/* 3. Vitals Metric Grid (4 Cards with Signature Glowing Radial Containers) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        
        {/* Card 1: Intracardiac Lead II EGM (Cyan Glow) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Lead II Intracardiac EGM</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              {activePatient.rWaveAmplitudeMv} <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>mV</span>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0284c7' }}>
              ● Calibrated Calipers Active
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #ecfeff 0%, #a5f3fc 65%, rgba(165, 243, 252, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(6, 182, 212, 0.2)' }}>
            <Zap size={32} color="#0891b2" />
          </div>
        </div>

        {/* Card 2: Arterial PPG Pulse Wave (Rose/Red Glow) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Arterial Pulse Transit (PTT)</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              182 <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>ms</span>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e11d48' }}>
              ● Dicrotic Notch Intact
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #ffe4e6 0%, #fecdd3 65%, rgba(254, 205, 211, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(225, 29, 72, 0.2)' }}>
            <Waves size={32} color="#e11d48" />
          </div>
        </div>

        {/* Card 3: SpO2 Oxygenation (Emerald Glow) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Blood Oxygenation</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              98% <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>SpO₂</span>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#059669' }}>
              ● Peripheral Perfusion Normal
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #ecfdf5 0%, #a7f3d0 65%, rgba(167, 243, 208, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(16, 185, 129, 0.2)' }}>
            <Droplets size={32} color="#059669" />
          </div>
        </div>

        {/* Card 4: Thoracic BIA Fluid Impedance (Amber Glow) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Thoracic BIA Impedance</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              {activePatient.leadImpedanceOhms} <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>Ω</span>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#d97706' }}>
              ● Tidal Coupling Active
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #fef3c7 0%, #fde68a 65%, rgba(253, 230, 138, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(245, 158, 11, 0.2)' }}>
            <Wind size={32} color="#d97706" />
          </div>
        </div>

      </div>

      {/* 4. Tri-Colour Diagnostic Rings (3 Equal Cards Matching Photo Layout) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        {/* Ring 1: Ventricular Sensing Margin (Royal Blue) */}
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
                strokeDashoffset={(2 * Math.PI * 32) * (1 - 1.5 / 2.5)}
                className="circular-ring-progress"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>1.5 mV</div>
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Ventricular Sensing Margin</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Threshold: 1.0 mV Nominal</div>
          </div>
        </div>

        {/* Ring 2: Capture Voltage Margin (Sunset Amber) */}
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
                strokeDashoffset={(2 * Math.PI * 32) * (1 - 0.5 / 1.5)}
                className="circular-ring-progress"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>0.5 V</div>
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Capture Voltage Margin</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Pulse Width: 0.24 ms</div>
          </div>
        </div>

        {/* Ring 3: Evoked Response Confidence (Emerald Mint) */}
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
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Evoked Response Confidence</div>
            <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600 }}>Capture Verified</div>
          </div>
        </div>

      </div>

      {/* 5. Live Multi-Signal Oscilloscope Cards (Lead II, PPG, SpO2, BIA) */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Oscilloscope Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setIsPlayingStrip(!isPlayingStrip)}
              style={{ width: 30, height: 30, borderRadius: '50%', background: '#ffffff', border: '1.5px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0f172a' }}
              title={isPlayingStrip ? 'Freeze Oscilloscope' : 'Resume Oscilloscope'}
            >
              {isPlayingStrip ? <Pause size={13} fill="#0f172a" /> : <Play size={13} fill="#0f172a" style={{ marginLeft: 2 }} />}
            </button>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                Multi-Channel Intracardiac Oscilloscope
              </h3>
              <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>
                ● Continuous Synchronized Lead II, Arterial PPG, SpO₂ & Thoracic BIA
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="signal-color-pill ecg-pill active">Lead II EGM</span>
            <span className="signal-color-pill ppg-pill active">PPG Pulse</span>
            <span className="signal-color-pill spo2-pill active">SpO₂</span>
            <span className="signal-color-pill bia-pill active">BIA Thoracic</span>
          </div>
        </div>

        {/* Track 1: Lead II ECG */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#1d4ed8' }}>
            <span>Lead II Intracardiac ECG (Digital Calipers Active)</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: '#64748b' }}>{sweepSpeed} mm/s • 10 mm/mV</span>
          </div>
          <ECGCanvas data={data} leadName="Lead II" height={160} showCalipers={true} />
        </div>

        {/* Track 2: Arterial PPG Pulse Wave */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#be123c' }}>
            <span>Arterial PPG (Pulse Waveform & Dicrotic Notch)</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: '#64748b' }}>PTT ~182 ms</span>
          </div>
          <div style={{ height: '80px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', padding: '5px' }}>
            <svg width="100%" height="70" viewBox="0 0 600 70" preserveAspectRatio="none">
              <path
                d="M 0 50 Q 20 10, 35 18 T 60 50 Q 80 10, 95 18 T 120 50 Q 140 10, 155 18 T 180 50 Q 200 10, 215 18 T 240 50 Q 260 10, 275 18 T 300 50 Q 320 10, 335 18 T 360 50 Q 380 10, 395 18 T 420 50 Q 440 10, 455 18 T 480 50 Q 500 10, 515 18 T 540 50 Q 560 10, 575 18 T 600 50"
                fill="none"
                stroke="#e11d48"
                strokeWidth="2.4"
              />
            </svg>
          </div>
        </div>

        {/* Time Markers */}
        <div className="rhythm-time-markers">
          <span>0:00 - 0:10 (Segment Alpha)</span>
          <span>0:10 - 0:20 (Segment Beta)</span>
          <span>0:20 - 0:30 (Continuous Live Sync)</span>
        </div>
      </div>

      {/* 6. Embedded Prompt 3: 5-Stage Cardiac Impulse Panel */}
      <CardiacImpulsePanel currentLrl={activePatient.lowerRateLimit} />

      {/* 7. Embedded Prompt 4: Fault Injection & Sensor Degradation Console */}
      <FaultInjectionPanel />

      {/* 8. Dual Action Buttons (Photo Style) */}
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
          Export Telemetry CSV
        </button>

        <button
          onClick={handleExportJson}
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
          <FileJson size={18} color="#ffffff" />
          Export Telemetry JSON
        </button>
      </div>

    </div>
  );
};
