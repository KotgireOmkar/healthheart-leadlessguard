import React, { useState } from 'react';
import { 
  Battery, 
  Zap, 
  Flame, 
  Clock, 
  ShieldAlert, 
  Sliders, 
  BarChart3, 
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Download,
  FileText
} from 'lucide-react';

export const BatteryModelView: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<'STANDARD' | 'CONTINUOUS' | 'LOW_DUTY' | 'FLOOD_ATTACK'>('STANDARD');
  const [isPlayingStrip, setIsPlayingStrip] = useState<boolean>(true);

  // Scenarios configuration
  const scenarios = {
    STANDARD: {
      title: 'Standard Periodic Telemetry (Nominal Clinical Baseline)',
      dutyCyclePct: 1.6,
      sleepCurrentUa: 1.2,
      senseCurrentUa: 15.0,
      pacingEnergyUj: 1.8,
      bleCurrentMa: 8.5,
      bleWakeSecPerDay: 1440, // 1 sec every min
      projectedLongevityYears: 8.4,
      batteryLevelPct: 92,
      riskLevel: 'LOW_NOMINAL',
      color: '#10b981'
    },
    CONTINUOUS: {
      title: 'Continuous High-Rate Telemetry (Intensive Monitoring)',
      dutyCyclePct: 85.0,
      sleepCurrentUa: 1.2,
      senseCurrentUa: 15.0,
      pacingEnergyUj: 1.8,
      bleCurrentMa: 8.5,
      bleWakeSecPerDay: 73440,
      projectedLongevityYears: 1.2,
      batteryLevelPct: 92,
      riskLevel: 'HIGH_DEPLETION',
      color: '#f59e0b'
    },
    LOW_DUTY: {
      title: 'Ultra-Low Duty Cycle (Long-Term Preservation)',
      dutyCyclePct: 0.1,
      sleepCurrentUa: 1.2,
      senseCurrentUa: 15.0,
      pacingEnergyUj: 1.8,
      bleCurrentMa: 8.5,
      bleWakeSecPerDay: 24, // 1 sec per hour
      projectedLongevityYears: 11.8,
      batteryLevelPct: 92,
      riskLevel: 'MAX_LONGEVITY',
      color: '#2563eb'
    },
    FLOOD_ATTACK: {
      title: 'Resource-Exhaustion BLE Flood Attack (Security Drain Test)',
      dutyCyclePct: 100.0,
      sleepCurrentUa: 1.2,
      senseCurrentUa: 15.0,
      pacingEnergyUj: 1.8,
      bleCurrentMa: 14.2,
      bleWakeSecPerDay: 86400,
      projectedLongevityYears: 0.7,
      batteryLevelPct: 88,
      riskLevel: 'CRITICAL_DEPLETION',
      color: '#ef4444'
    }
  };

  const current = scenarios[selectedScenario];

  const handleExportPowerReport = () => {
    const report = {
      chemistry: 'Li/CFx 240 mAh Cell',
      scenario: current.title,
      projectedLongevityYears: current.projectedLongevityYears,
      quiescentSleepCurrentUa: current.sleepCurrentUa,
      cardiacSenseCurrentUa: current.senseCurrentUa,
      bleWakeBurstMa: current.bleCurrentMa,
      dutyCyclePct: current.dutyCyclePct,
      generatedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'leadlessguard_power_budget_report.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="content-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. Persona Header Card with Status Capsules */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '20px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#ecfdf5', border: '2px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#047857', fontWeight: 800, fontSize: '1.15rem' }}>
            <Battery size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>Energy Budgeting & Duty-Cycle Model</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
              Leadless Pacemaker Microampere Longevity Engine
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', fontSize: '0.74rem', color: '#64748b' }}>
              <span>Chemistry: <strong style={{ color: '#0f172a' }}>Li/CFx 240 mAh Primary Cell</strong></span>
              <span>•</span>
              <span>Baseline Drain: <strong style={{ color: '#059669' }}>1.2 μA Quiescent Sleep</strong></span>
              <span>•</span>
              <span>BLE Burst: <strong style={{ color: '#2563eb' }}>8.5 mA Active TX</strong></span>
            </div>
          </div>
        </div>

        {/* Status Capsules Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div className="badge-emerald" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            <CheckCircle2 size={16} />
            <span>Quiescent Sleep Active</span>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '9999px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <Zap size={16} color="#059669" />
            <span>Drain: 1.2 μA Baseline</span>
          </div>
        </div>
      </div>

      {/* 2. Signature Hero Metric Card & Secondary Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        
        {/* Card 1: Projected Battery Longevity (Emerald Glow Container) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Projected Longevity</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              {current.projectedLongevityYears} <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>Years</span>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: current.color }}>
              ● {current.title.split(' ')[0]} Schedule Active
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #ecfdf5 0%, #a7f3d0 65%, rgba(167, 243, 208, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(16, 185, 129, 0.2)' }}>
            <Battery size={32} color="#059669" />
          </div>
        </div>

        {/* Card 2: Remaining Cell Capacity (Blue Glow Container) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Remaining Cell Capacity</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              {current.batteryLevelPct}%
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2563eb' }}>
              ● 220.8 mAh Available
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #eff6ff 0%, #bfdbfe 65%, rgba(191, 219, 254, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(37, 99, 235, 0.2)' }}>
            <Zap size={32} color="#2563eb" />
          </div>
        </div>

        {/* Card 3: BLE Radio Wake Budget (Amber Glow Container) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>BLE Radio Wake Duty</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              {current.dutyCyclePct}%
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#d97706' }}>
              ● {current.bleWakeSecPerDay}s Transmission / Day
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #fef3c7 0%, #fde68a 65%, rgba(253, 230, 138, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(245, 158, 11, 0.2)' }}>
            <Clock size={32} color="#d97706" />
          </div>
        </div>

      </div>

      {/* 3. Tri-Colour Power Budget Rings (Photo Style) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        {/* Ring 1: Deep Sleep Duty Cycle (Royal Blue) */}
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
                strokeDashoffset={(2 * Math.PI * 32) * (1 - 0.984)}
                className="circular-ring-progress"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>98.4%</div>
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Deep Sleep Duty Cycle</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>1.2 μA Quiescent Current</div>
          </div>
        </div>

        {/* Ring 2: Cardiac Sensing Drain (Sunset Amber) */}
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
                strokeDashoffset={(2 * Math.PI * 32) * (1 - 15.0 / 30.0)}
                className="circular-ring-progress"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>15.0μA</div>
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Cardiac Sensing Drain</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Continuous Sense Amplifier</div>
          </div>
        </div>

        {/* Ring 3: BLE Wake Telemetry Budget (Emerald Mint) */}
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
                strokeDashoffset={(2 * Math.PI * 32) * (1 - current.dutyCyclePct / 100)}
                className="circular-ring-progress"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>{current.dutyCyclePct}%</div>
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>BLE Telemetry Budget</div>
            <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600 }}>1s / min Burst Window</div>
          </div>
        </div>

      </div>

      {/* 4. Live Current Drain Oscilloscope Strip */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setIsPlayingStrip(!isPlayingStrip)}
              style={{ width: 30, height: 30, borderRadius: '50%', background: '#ffffff', border: '1.5px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0f172a' }}
              title={isPlayingStrip ? 'Freeze Drain Stream' : 'Resume Drain Stream'}
            >
              {isPlayingStrip ? <Pause size={13} fill="#0f172a" /> : <Play size={13} fill="#0f172a" style={{ marginLeft: 2 }} />}
            </button>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                Instantaneous Current Drain Curve (Sleep vs Sense vs BLE Wake)
              </h3>
              <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>
                ● Microampere Oscilloscope with Logarithmic TX Bursts
              </span>
            </div>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
            Peak Burst: {current.bleCurrentMa} mA • Quiescent: {current.sleepCurrentUa} μA
          </span>
        </div>

        {/* Current Drain Profile Wave */}
        <div style={{ height: '110px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px', overflow: 'hidden' }}>
          <svg width="100%" height="90" viewBox="0 0 600 90" preserveAspectRatio="none">
            <path
              d="M 0 80 L 100 80 L 120 70 L 140 80 L 250 80 L 260 10 L 280 10 L 290 80 L 400 80 L 420 70 L 440 80 L 550 80 L 560 10 L 580 10 L 590 80 L 600 80"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
            />
          </svg>
        </div>

        {/* Time Interval Markers */}
        <div className="rhythm-time-markers">
          <span>0s - 20s (Deep Sleep 1.2μA)</span>
          <span>20s - 40s (Sensing Event 15μA)</span>
          <span>40s - 60s (BLE Radio Burst 8.5mA)</span>
        </div>
      </div>

      {/* 5. 4 Duty-Cycle Scenario Selector Grid */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
          Duty-Cycle Schedule Matrix (Select to Benchmark Longevity)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
          {(['STANDARD', 'CONTINUOUS', 'LOW_DUTY', 'FLOOD_ATTACK'] as const).map(scKey => {
            const sc = scenarios[scKey];
            const isSelected = selectedScenario === scKey;
            return (
              <div
                key={scKey}
                onClick={() => setSelectedScenario(scKey)}
                style={{
                  background: isSelected ? '#f8fafc' : '#ffffff',
                  border: `2px solid ${isSelected ? sc.color : '#eaecf0'}`,
                  borderRadius: '16px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? `0 2px 8px ${sc.color}25` : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>{sc.title.split('(')[0]}</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: sc.color, fontFamily: 'var(--font-mono)' }}>
                    {sc.projectedLongevityYears} Yrs
                  </span>
                </div>
                <p style={{ fontSize: '0.74rem', color: '#64748b', lineHeight: 1.4 }}>
                  {sc.title}
                </p>
                <div style={{ marginTop: '8px', fontSize: '0.7rem', color: sc.color, fontWeight: 700 }}>
                  Duty Cycle: {sc.dutyCyclePct}% • TX: {sc.bleWakeSecPerDay}s/day
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Dual Action Buttons (Photo Style) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '4px' }}>
        <button
          onClick={() => setSelectedScenario('FLOOD_ATTACK')}
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
          <Flame size={18} color="#ef4444" />
          Run BLE Flood Drain Test
        </button>

        <button
          onClick={handleExportPowerReport}
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
          <Download size={18} color="#ffffff" />
          Export Power Budget Report
        </button>
      </div>

    </div>
  );
};
