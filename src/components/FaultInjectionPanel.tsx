import React, { useState } from 'react';
import { 
  AlertTriangle, 
  WifiOff, 
  Activity, 
  Sliders, 
  RotateCcw,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

export interface ActiveFaults {
  motionArtifact: boolean;
  poorContact: boolean;
  sensorDisconnected: boolean;
  lowAmplitude: boolean;
  unrealisticSpO2Dip: boolean;
  telemetryPacketLoss: boolean;
}

interface FaultInjectionPanelProps {
  onFaultsChanged?: (faults: ActiveFaults) => void;
}

export const FaultInjectionPanel: React.FC<FaultInjectionPanelProps> = ({ onFaultsChanged }) => {
  const [faults, setFaults] = useState<ActiveFaults>({
    motionArtifact: false,
    poorContact: false,
    sensorDisconnected: false,
    lowAmplitude: false,
    unrealisticSpO2Dip: false,
    telemetryPacketLoss: false
  });

  const toggleFault = (key: keyof ActiveFaults) => {
    const updated = { ...faults, [key]: !faults[key] };
    setFaults(updated);
    if (onFaultsChanged) onFaultsChanged(updated);
  };

  const resetAllFaults = () => {
    const cleared: ActiveFaults = {
      motionArtifact: false,
      poorContact: false,
      sensorDisconnected: false,
      lowAmplitude: false,
      unrealisticSpO2Dip: false,
      telemetryPacketLoss: false
    };
    setFaults(cleared);
    if (onFaultsChanged) onFaultsChanged(cleared);
  };

  // Compute composite Signal Quality Index (SQI) based on active faults
  const activeCount = Object.values(faults).filter(Boolean).length;
  let sqiScore = 98 - activeCount * 22;
  if (faults.sensorDisconnected) sqiScore = 8;
  sqiScore = Math.max(5, Math.min(99, sqiScore));

  let sqiStatus: 'GOOD' | 'ACCEPTABLE' | 'POOR' | 'UNAVAILABLE' = 'GOOD';
  if (faults.sensorDisconnected || sqiScore < 20) sqiStatus = 'UNAVAILABLE';
  else if (sqiScore < 60) sqiStatus = 'POOR';
  else if (sqiScore < 85) sqiStatus = 'ACCEPTABLE';

  return (
    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
      {/* Panel Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: activeCount > 0 ? '#ef4444' : '#10b981' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
              Electrophysiology Fault & Sensor Degradation Console
            </h3>
            <span className={activeCount > 0 ? 'badge-coral' : 'badge-emerald'} style={{ fontSize: '0.7rem' }}>
              {activeCount > 0 ? `${activeCount} Faults Active` : 'Clean Telemetry'}
            </span>
          </div>
          <p style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
            Simulate physiological sensor anomalies, hardware disconnects, and telemetry packet dropouts to test platform resiliency.
          </p>
        </div>

        <button
          onClick={resetAllFaults}
          disabled={activeCount === 0}
          style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: activeCount > 0 ? '#eff6ff' : '#f8fafc', color: activeCount > 0 ? '#1d4ed8' : '#94a3b8', fontSize: '0.75rem', fontWeight: 700, cursor: activeCount > 0 ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <RotateCcw size={13} />
          Reset All Normal
        </button>
      </div>

      {/* Fault Toggle Buttons Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
        
        {/* Fault 1: Motion Artifact */}
        <button
          onClick={() => toggleFault('motionArtifact')}
          style={{
            padding: '12px 14px',
            borderRadius: '12px',
            border: `1.5px solid ${faults.motionArtifact ? '#ef4444' : '#e2e8f0'}`,
            background: faults.motionArtifact ? '#fef2f2' : '#ffffff',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: faults.motionArtifact ? '#b91c1c' : '#0f172a' }}>
              Motion Artifact
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Tremor baseline wander</div>
          </div>
          <span style={{ width: 18, height: 18, borderRadius: '50%', background: faults.motionArtifact ? '#ef4444' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '0.65rem', fontWeight: 900 }}>
            {faults.motionArtifact ? '✓' : ''}
          </span>
        </button>

        {/* Fault 2: Poor Contact */}
        <button
          onClick={() => toggleFault('poorContact')}
          style={{
            padding: '12px 14px',
            borderRadius: '12px',
            border: `1.5px solid ${faults.poorContact ? '#f59e0b' : '#e2e8f0'}`,
            background: faults.poorContact ? '#fffbeb' : '#ffffff',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: faults.poorContact ? '#b45309' : '#0f172a' }}>
              Poor Sensor Contact
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Elevated 1200Ω impedance</div>
          </div>
          <span style={{ width: 18, height: 18, borderRadius: '50%', background: faults.poorContact ? '#f59e0b' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '0.65rem', fontWeight: 900 }}>
            {faults.poorContact ? '✓' : ''}
          </span>
        </button>

        {/* Fault 3: Disconnected */}
        <button
          onClick={() => toggleFault('sensorDisconnected')}
          style={{
            padding: '12px 14px',
            borderRadius: '12px',
            border: `1.5px solid ${faults.sensorDisconnected ? '#dc2626' : '#e2e8f0'}`,
            background: faults.sensorDisconnected ? '#fef2f2' : '#ffffff',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: faults.sensorDisconnected ? '#991b1b' : '#0f172a' }}>
              Sensor Disconnected
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Zero signal / Flatline</div>
          </div>
          <span style={{ width: 18, height: 18, borderRadius: '50%', background: faults.sensorDisconnected ? '#dc2626' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '0.65rem', fontWeight: 900 }}>
            {faults.sensorDisconnected ? '✓' : ''}
          </span>
        </button>

        {/* Fault 4: Low Signal Amplitude */}
        <button
          onClick={() => toggleFault('lowAmplitude')}
          style={{
            padding: '12px 14px',
            borderRadius: '12px',
            border: `1.5px solid ${faults.lowAmplitude ? '#f59e0b' : '#e2e8f0'}`,
            background: faults.lowAmplitude ? '#fffbeb' : '#ffffff',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: faults.lowAmplitude ? '#b45309' : '#0f172a' }}>
              Low Signal Amplitude
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Low perfusion attenuation</div>
          </div>
          <span style={{ width: 18, height: 18, borderRadius: '50%', background: faults.lowAmplitude ? '#f59e0b' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '0.65rem', fontWeight: 900 }}>
            {faults.lowAmplitude ? '✓' : ''}
          </span>
        </button>

        {/* Fault 5: Unrealistic SpO2 Dip */}
        <button
          onClick={() => toggleFault('unrealisticSpO2Dip')}
          style={{
            padding: '12px 14px',
            borderRadius: '12px',
            border: `1.5px solid ${faults.unrealisticSpO2Dip ? '#8b5cf6' : '#e2e8f0'}`,
            background: faults.unrealisticSpO2Dip ? '#f5f3ff' : '#ffffff',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: faults.unrealisticSpO2Dip ? '#6d28d9' : '#0f172a' }}>
              Unrealistic SpO₂ Dip
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Immediate plunge to 72%</div>
          </div>
          <span style={{ width: 18, height: 18, borderRadius: '50%', background: faults.unrealisticSpO2Dip ? '#8b5cf6' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '0.65rem', fontWeight: 900 }}>
            {faults.unrealisticSpO2Dip ? '✓' : ''}
          </span>
        </button>

        {/* Fault 6: Telemetry Packet Loss */}
        <button
          onClick={() => toggleFault('telemetryPacketLoss')}
          style={{
            padding: '12px 14px',
            borderRadius: '12px',
            border: `1.5px solid ${faults.telemetryPacketLoss ? '#06b6d4' : '#e2e8f0'}`,
            background: faults.telemetryPacketLoss ? '#ecfeff' : '#ffffff',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: faults.telemetryPacketLoss ? '#0e7490' : '#0f172a' }}>
              BLE Packet Loss
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>35% frame dropout simulation</div>
          </div>
          <span style={{ width: 18, height: 18, borderRadius: '50%', background: faults.telemetryPacketLoss ? '#06b6d4' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '0.65rem', fontWeight: 900 }}>
            {faults.telemetryPacketLoss ? '✓' : ''}
          </span>
        </button>
      </div>

      {/* Signal Quality Gauge & Resiliency Alert */}
      <div style={{ marginTop: '14px', padding: '12px 16px', borderRadius: '12px', background: sqiScore < 70 ? '#fef2f2' : '#f8fafc', border: `1px solid ${sqiScore < 70 ? '#fecaca' : '#e2e8f0'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: sqiScore < 70 ? '#fee2e2' : '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {sqiScore < 70 ? <AlertTriangle size={18} color="#ef4444" /> : <CheckCircle2 size={18} color="#10b981" />}
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
              Composite Signal Quality Index (SQI): {sqiScore}%
            </div>
            <div style={{ fontSize: '0.72rem', color: sqiScore < 70 ? '#b91c1c' : '#64748b' }}>
              {sqiScore < 70 ? '⚠ Telemetry degraded — displayed values flagged unconfirmed' : 'Telemetry integrity validated across all active channels'}
            </div>
          </div>
        </div>

        <span className={sqiStatus === 'GOOD' ? 'badge-emerald' : sqiStatus === 'ACCEPTABLE' ? 'badge-blue' : sqiStatus === 'POOR' ? 'badge-amber' : 'badge-coral'}>
          SQI Status: {sqiStatus}
        </span>
      </div>
    </div>
  );
};
