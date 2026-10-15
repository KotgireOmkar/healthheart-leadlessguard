import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Activity, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Play,
  RotateCcw
} from 'lucide-react';
import { pacingEngine } from '../services/pacingEngine';

interface CardiacImpulsePanelProps {
  currentLrl?: number;
}

export const CardiacImpulsePanel: React.FC<CardiacImpulsePanelProps> = ({ currentLrl = 60 }) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [lastDecision, setLastDecision] = useState<{
    type: 'INTRINSIC_INHIBIT' | 'PACING_DELIVERED';
    intervalMs: number;
    escapeMs: number;
  }>({
    type: 'INTRINSIC_INHIBIT',
    intervalMs: 820,
    escapeMs: Math.round(60000 / currentLrl)
  });

  const escapeMs = Math.round(60000 / currentLrl);

  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // Step through 1 -> 2 -> 3 -> 4 -> 5
      setActiveStep(prev => {
        if (prev === 5) {
          // evaluate beat decision
          const simulatedInterval = Math.random() > 0.35 ? 780 + Math.round(Math.random() * 80) : 1080;
          const isPaced = simulatedInterval > escapeMs;
          setLastDecision({
            type: isPaced ? 'PACING_DELIVERED' : 'INTRINSIC_INHIBIT',
            intervalMs: simulatedInterval,
            escapeMs
          });
          return 1;
        }
        return prev + 1;
      });
    }, 700);

    return () => clearInterval(interval);
  }, [isSimulating, escapeMs]);

  const steps = [
    {
      id: 1,
      title: 'Intrinsic Event',
      sub: 'Ventricular Depolarization',
      latency: '0.0 ms',
      color: '#2563eb',
      bgColor: '#eff6ff',
      borderColor: '#bfdbfe',
      icon: <Activity size={18} color="#2563eb" />
    },
    {
      id: 2,
      title: 'Simulated Sensing',
      sub: 'Amp Threshold > 1.5 mV',
      latency: '1.2 ms',
      color: '#06b6d4',
      bgColor: '#ecfeff',
      borderColor: '#a5f3fc',
      icon: <CheckCircle2 size={18} color="#06b6d4" />
    },
    {
      id: 3,
      title: 'Pacing Decision',
      sub: `Escape Timer (${escapeMs} ms)`,
      latency: '2.4 ms',
      color: '#8b5cf6',
      bgColor: '#f5f3ff',
      borderColor: '#ddd6fe',
      icon: <Clock size={18} color="#8b5cf6" />
    },
    {
      id: 4,
      title: 'Pacing Delivery',
      sub: lastDecision.type === 'PACING_DELIVERED' ? 'Stimulus Pulse (0.5V / 0.24ms)' : 'Output Inhibited (Save Energy)',
      latency: '3.1 ms',
      color: '#f59e0b',
      bgColor: '#fffbeb',
      borderColor: '#fde68a',
      icon: <Zap size={18} color="#f59e0b" />
    },
    {
      id: 5,
      title: 'Evoked Response',
      sub: lastDecision.type === 'PACING_DELIVERED' ? 'Ventricular Capture Verified' : 'Intrinsic R-Wave Confirmed',
      latency: '12.8 ms',
      color: '#10b981',
      bgColor: '#ecfdf5',
      borderColor: '#a7f3d0',
      icon: <CheckCircle2 size={18} color="#10b981" />
    }
  ];

  return (
    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
      {/* Panel Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#2563eb' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
              Cardiac Impulse & Pacing Decision Flow
            </h3>
            <span className="badge-blue" style={{ fontSize: '0.7rem' }}>VVI Algorithmic Model</span>
          </div>
          <p style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
            5-Stage Real-Time Electrophysiology Decision Pipeline (Sensing, Escape Timer, Output Delivery & Capture Verification)
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <Play size={13} />
            {isSimulating ? 'Pause Flow' : 'Auto Step'}
          </button>
          <button
            onClick={() => {
              setActiveStep(1);
              setLastDecision({ type: 'INTRINSIC_INHIBIT', intervalMs: 820, escapeMs });
            }}
            style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#64748b', fontSize: '0.75rem', cursor: 'pointer' }}
            title="Reset to Initial Step"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* 5-Step Animated Visual Nodes Pipeline */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', position: 'relative' }}>
        {steps.map((s, idx) => {
          const isCurrent = activeStep === s.id;
          return (
            <div
              key={s.id}
              style={{
                background: isCurrent ? s.bgColor : '#ffffff',
                border: `2px solid ${isCurrent ? s.color : '#e2e8f0'}`,
                borderRadius: '14px',
                padding: '14px',
                position: 'relative',
                boxShadow: isCurrent ? `0 4px 14px ${s.color}25` : '0 1px 3px rgba(0,0,0,0.02)',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Step indicator header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: s.color, background: `${s.color}18`, padding: '2px 6px', borderRadius: '6px' }}>
                  STEP 0{s.id}
                </span>
                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                  {s.latency}
                </span>
              </div>

              {/* Node Icon & Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{ width: 28, height: 28, borderRadius: '8px', background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {s.icon}
                </div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>{s.title}</h4>
              </div>

              <p style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.3 }}>
                {s.sub}
              </p>

              {/* Active Pulsing Indicator Dot */}
              {isCurrent && (
                <div style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: '50%', background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Decision Summary Banner */}
      <div style={{ marginTop: '14px', padding: '12px 16px', borderRadius: '12px', background: lastDecision.type === 'PACING_DELIVERED' ? '#fffbeb' : '#f0fdf4', border: `1px solid ${lastDecision.type === 'PACING_DELIVERED' ? '#fde68a' : '#bbf7d0'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: lastDecision.type === 'PACING_DELIVERED' ? '#f59e0b' : '#10b981' }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
            Latest Decision Cycle: {lastDecision.type === 'PACING_DELIVERED' ? 'Ventricular Stimulus Delivered (VP)' : 'Pacing Output Inhibited (VS)'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
          <span>Measured Interval: <strong style={{ color: '#0f172a' }}>{lastDecision.intervalMs} ms</strong></span>
          <span>Escape Threshold: <strong style={{ color: '#0f172a' }}>{lastDecision.escapeMs} ms</strong></span>
          <span className={lastDecision.type === 'PACING_DELIVERED' ? 'badge-amber' : 'badge-emerald'}>
            {lastDecision.type === 'PACING_DELIVERED' ? 'Burden +1' : 'Pacing Inhibited'}
          </span>
        </div>
      </div>
    </div>
  );
};
