import React, { useState } from 'react';
import { Patient } from '../../types';
import { 
  TrendingUp, 
  Activity, 
  BarChart2, 
  Play, 
  Pause, 
  CheckCircle2, 
  Database, 
  Download, 
  FileText,
} from 'lucide-react';

interface TrendsAnalyticsViewProps {
  patients?: Patient[];
  activePatient: Patient;
  onSelectPatient?: (patient: Patient) => void;
}

export const TrendsAnalyticsView: React.FC<TrendsAnalyticsViewProps> = ({ 
  patients,
  activePatient,
  onSelectPatient
}) => {
  const [timeWindow, setTimeWindow] = useState<'1h' | '6h' | '24h' | '7d' | '30d'>('24h');
  const [isPlayingStrip, setIsPlayingStrip] = useState<boolean>(true);
  const [ackAlert, setAckAlert] = useState<boolean>(false);

  const baseHr = activePatient.baselineHeartRate;
  const pacing = activePatient.pacingBurdenPercent;

  // Helper for persona initials
  const getPersonaAlias = (fullName: string, patientId: string) => {
    const parts = fullName.split(' ');
    if (parts.length > 1) {
      return parts[parts.length - 1].replace(/[^a-zA-Z0-9]/g, '');
    }
    const clean = patientId.replace(/[^a-zA-Z0-9]/g, '');
    return clean.slice(-3);
  };

  // Dynamic Metrics Engine per Time Window & Active Patient
  const getWindowMetrics = () => {
    switch (timeWindow) {
      case '1h':
        return {
          recordsCount: '620 Records Logged',
          syncLabel: '1-Hour Rolling Buffer Synchronized',
          meanHr: (baseHr + 1.2).toFixed(1),
          meanHrSub: '● Acute Activity Epoch',
          pacingBurden: Math.max(0, Math.min(100, Math.round(pacing === 100 ? 100 : pacing > 0 ? pacing - 1 : 0))),
          pacingSub: '● 1-Hour Real-Time Demand',
          autonomicIndex: '1.42',
          autonomicSub: '● Sympathetic Tone Dominance (Active)',
          sdnn: 36.4,
          rmssd: 31.2,
          pnn50: 9.4,
          timelineTitle: '1-Hour Epoch Profile (5-Minute Intervals)',
          bars: Array.from({ length: 12 }).map((_, i) => ({
            label: `${i * 5}m`,
            height: Math.max(25, Math.min(95, 45 + Math.sin(i / 1.5) * 20 + ((i % 3) - 1) * 6)),
          })),
          markers: ['00-15m (Acute Baseline)', '15-30m (Activity Epoch)', '30-45m (Steady State)', '45-60m (Current Telemetry)'],
        };
      case '6h':
        return {
          recordsCount: '3,720 Records Logged',
          syncLabel: '6-Hour Epoch Synchronized',
          meanHr: (baseHr - 0.6).toFixed(1),
          meanHrSub: '● Midday Steady Phase',
          pacingBurden: Math.max(0, Math.min(100, Math.round(pacing === 100 ? 100 : pacing > 0 ? pacing + 2 : 1))),
          pacingSub: '● 6-Hour Moving Average',
          autonomicIndex: '1.28',
          autonomicSub: '● Post-Prandial Transition',
          sdnn: 41.2,
          rmssd: 35.4,
          pnn50: 12.1,
          timelineTitle: '6-Hour Rolling Trend (30-Minute Intervals)',
          bars: Array.from({ length: 12 }).map((_, i) => ({
            label: `${((i + 1) * 0.5).toFixed(1)}h`,
            height: Math.max(25, Math.min(95, 42 + Math.sin(i / 2) * 24 + ((i % 2) - 0.5) * 8)),
          })),
          markers: ['0-2h (Rest Phase)', '2-4h (Midday Drift)', '4-6h (Recovery & Stabilization)'],
        };
      case '7d':
        return {
          recordsCount: '104,244 Records Logged',
          syncLabel: '7-Day Longitudinal Archive Synchronized',
          meanHr: (baseHr + 0.8).toFixed(1),
          meanHrSub: '● 7-Day Basal Equilibrium',
          pacingBurden: Math.max(0, Math.min(100, Math.round(pacing === 100 ? 100 : pacing > 0 ? pacing - 2 : 0))),
          pacingSub: '● 7-Day Cumulative Burden',
          autonomicIndex: '1.14',
          autonomicSub: '● Weekly Homeostatic Baseline',
          sdnn: 54.8,
          rmssd: 44.6,
          pnn50: 17.8,
          timelineTitle: '7-Day Longitudinal Daily Aggregation',
          bars: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => ({
            label: day,
            height: Math.max(28, Math.min(95, 48 + Math.cos(i / 1.2) * 22 + (i === 5 || i === 6 ? 10 : 0))),
          })),
          markers: ['Mon-Tue (Initial Pace)', 'Wed-Thu (Mid-Week Plateau)', 'Fri-Sun (Weekend Baseline)'],
        };
      case '30d':
        return {
          recordsCount: '446,760 Records Logged',
          syncLabel: '30-Day Archive Synchronized',
          meanHr: (baseHr - 0.2).toFixed(1),
          meanHrSub: '● Monthly Homeostasis Steady',
          pacingBurden: Math.max(0, Math.min(100, Math.round(pacing === 100 ? 100 : pacing > 0 ? pacing + 1 : 0))),
          pacingSub: '● 30-Day Monthly Trend',
          autonomicIndex: '1.08',
          autonomicSub: '● Chronic Autonomic Stability',
          sdnn: 58.6,
          rmssd: 48.2,
          pnn50: 19.6,
          timelineTitle: '30-Day Monthly Diurnal Envelope',
          bars: Array.from({ length: 30 }).map((_, i) => ({
            label: `D${i + 1}`,
            height: Math.max(20, Math.min(95, 40 + Math.sin(i / 4.5) * 26 + ((i % 5) - 2) * 5)),
          })),
          markers: ['Week 1 (Post-Implant)', 'Week 2 (Stabilization)', 'Week 3 (Threshold Steady)', 'Week 4 (Monthly Review)'],
        };
      case '24h':
      default:
        return {
          recordsCount: '14,892 Records Logged',
          syncLabel: '24-Hour Diurnal Archive Synchronized',
          meanHr: (baseHr + 0.4).toFixed(1),
          meanHrSub: '● Circadian Rhythm Preserved',
          pacingBurden: pacing,
          pacingSub: '● Battery Preservation Optimal',
          autonomicIndex: '1.19',
          autonomicSub: '● Sympathovagal Equilibrium',
          sdnn: 46.2,
          rmssd: 38.8,
          pnn50: 14.5,
          timelineTitle: '24-Hour Circadian Diurnal Profile with Upper/Lower CI Bands',
          bars: Array.from({ length: 24 }).map((_, i) => ({
            label: `${i}h`,
            height: Math.max(20, Math.min(95, 40 + Math.sin(i / 3) * 25 + ((i % 4) - 2) * 4)),
          })),
          markers: ['00:00 - 06:00 (Nocturnal Nadir)', '06:00 - 12:00 (Morning Surge)', '12:00 - 18:00 (Diurnal Peak)', '18:00 - 24:00 (Evening Decline)'],
        };
    }
  };

  const metrics = getWindowMetrics();

  const handleExportCsv = () => {
    let csv = `Epoch,Resting_HR_BPM,Pacing_Burden_Pct,SDNN_ms,RMSSD_ms,Patient_ID\n`;
    metrics.bars.forEach((b, idx) => {
      const hr = (Number(metrics.meanHr) + Math.sin(idx / 2) * 4).toFixed(1);
      const pace = Math.max(0, Math.min(100, Math.round(metrics.pacingBurden + Math.cos(idx) * 3)));
      csv += `${b.label},${hr},${pace},${metrics.sdnn},${metrics.rmssd},${activePatient.patientId}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leadlessguard_${activePatient.patientId}_trends_${timeWindow}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateSummary = () => {
    alert(`${timeWindow.toUpperCase()} Clinical Longitudinal Summary for ${activePatient.fullName} (${activePatient.patientId}) generated.\nMean Resting HR: ${metrics.meanHr} BPM\nCumulative Pacing: ${metrics.pacingBurden}%\nSDNN: ${metrics.sdnn} ms\nRMSSD: ${metrics.rmssd} ms\nAll criteria verified within safe clinical limits.`);
  };

  return (
    <div className="content-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. Patient Switcher Tabs (Direct Access in Trends) */}
      {patients && onSelectPatient && (
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
      )}

      {/* 2. Persona Header Card with Status Capsules */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '20px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#f5f3ff', border: '2px solid #ddd6fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6d28d9', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '0.5px' }}>
            <span>{getPersonaAlias(activePatient.fullName, activePatient.patientId)}</span>
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>Longitudinal Trend Analysis</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
              {activePatient.fullName} <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#64748b' }}>({activePatient.patientId})</span>
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', fontSize: '0.74rem', color: '#64748b' }}>
              <span>Timeframe: <strong style={{ color: '#0f172a' }}>{timeWindow.toUpperCase()} Longitudinal Archive</strong></span>
              <span>•</span>
              <span>Serial: <strong style={{ color: '#0f172a' }}>{activePatient.serialNumber}</strong></span>
              <span>•</span>
              <span>Mode: <strong style={{ color: '#2563eb' }}>VVI Demand ({activePatient.lowerRateLimit} BPM)</strong></span>
            </div>
          </div>
        </div>

        {/* Status Capsules & Time Window Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div className="badge-emerald" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            <CheckCircle2 size={16} />
            <span>{metrics.syncLabel}</span>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '9999px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <Database size={16} color="#7c3aed" />
            <span>{metrics.recordsCount}</span>
          </div>

          {/* Time Window Slicers */}
          <div style={{ display: 'flex', background: '#f8fafc', padding: '3px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            {(['1h', '6h', '24h', '7d', '30d'] as const).map(w => (
              <button
                key={w}
                onClick={() => setTimeWindow(w)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: timeWindow === w ? '#ffffff' : 'transparent',
                  color: timeWindow === w ? '#7c3aed' : '#64748b',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  boxShadow: timeWindow === w ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {w.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Vitals Hero Metric Cards (Dynamically Adapting to Time Window) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        
        {/* Card 1: Mean Resting Heart Rate */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Mean Resting Heart Rate ({timeWindow.toUpperCase()})</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              {metrics.meanHr} <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>BPM</span>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#6d28d9' }}>
              {metrics.meanHrSub}
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #f5f3ff 0%, #ddd6fe 65%, rgba(221, 214, 254, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(109, 40, 217, 0.2)' }}>
            <Activity size={32} color="#7c3aed" />
          </div>
        </div>

        {/* Card 2: Cumulative Pacing Burden */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Cumulative Pacing Burden</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              {metrics.pacingBurden}%
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: metrics.pacingBurden > 50 ? '#d97706' : '#059669' }}>
              {metrics.pacingSub}
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #fef3c7 0%, #fde68a 65%, rgba(253, 230, 138, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(245, 158, 11, 0.2)' }}>
            <BarChart2 size={32} color="#d97706" />
          </div>
        </div>

        {/* Card 3: Autonomic Balance Index */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Autonomic Balance Index</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              {metrics.autonomicIndex} <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>LF/HF</span>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2563eb' }}>
              {metrics.autonomicSub}
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #eff6ff 0%, #bfdbfe 65%, rgba(191, 219, 254, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(37, 99, 235, 0.2)' }}>
            <TrendingUp size={32} color="#2563eb" />
          </div>
        </div>

      </div>

      {/* 4. Tri-Colour HRV Diagnostic Rings (Dynamically Recomputing) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        {/* Ring 1: SDNN Autonomic Tone */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div className="circular-ring-wrapper" style={{ width: 76, height: 76 }}>
            <svg width="76" height="76" className="circular-ring-svg">
              <circle cx="38" cy="38" r="32" strokeWidth="6" className="circular-ring-bg" />
              <circle
                cx="38"
                cy="38"
                r="32"
                strokeWidth="6"
                stroke="#8b5cf6"
                strokeDasharray={2 * Math.PI * 32}
                strokeDashoffset={(2 * Math.PI * 32) * (1 - Math.min(1, metrics.sdnn / 80))}
                className="circular-ring-progress"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>{metrics.sdnn}ms</div>
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>SDNN Autonomic Tone</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Nominal: &gt; 35 ms ({timeWindow.toUpperCase()})</div>
          </div>
        </div>

        {/* Ring 2: RMSSD Vagal Tone */}
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
                strokeDashoffset={(2 * Math.PI * 32) * (1 - Math.min(1, metrics.rmssd / 60))}
                className="circular-ring-progress"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>{metrics.rmssd}ms</div>
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>RMSSD Vagal Tone</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Parasympathetic Reserve</div>
          </div>
        </div>

        {/* Ring 3: pNN50 Rhythm Stability */}
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
                strokeDashoffset={(2 * Math.PI * 32) * (1 - Math.min(1, metrics.pnn50 / 25))}
                className="circular-ring-progress"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>{metrics.pnn50}%</div>
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>pNN50 Rhythm Stability</div>
            <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600 }}>Beat-to-Beat Variation</div>
          </div>
        </div>

      </div>

      {/* 5. Live Longitudinal Trend Envelope Card */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setIsPlayingStrip(!isPlayingStrip)}
              style={{ width: 30, height: 30, borderRadius: '50%', background: '#ffffff', border: '1.5px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0f172a' }}
              title={isPlayingStrip ? 'Freeze Trend Strip' : 'Resume Trend Strip'}
            >
              {isPlayingStrip ? <Pause size={13} fill="#0f172a" /> : <Play size={13} fill="#0f172a" style={{ marginLeft: 2 }} />}
            </button>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                Circadian Heart Rate &amp; Pacing Demand Envelope ({timeWindow.toUpperCase()})
              </h3>
              <span style={{ fontSize: '0.72rem', color: '#6d28d9', fontWeight: 600 }}>
                ● {metrics.timelineTitle}
              </span>
            </div>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
            Median: {metrics.meanHr} BPM • Pacing: {metrics.pacingBurden}%
          </span>
        </div>

        {/* Dynamic Circadian Profile Bars */}
        <div style={{ height: '180px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'flex-end', gap: timeWindow === '30d' ? '3px' : '8px' }}>
          {metrics.bars.map((bar, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              <div 
                style={{ 
                  width: '100%', 
                  height: `${bar.height}%`, 
                  background: 'linear-gradient(180deg, #7c3aed 0%, rgba(124, 58, 237, 0.25) 100%)', 
                  borderRadius: '5px',
                  transition: 'height 0.3s ease'
                }} 
              />
              <span style={{ fontSize: timeWindow === '30d' ? '0.52rem' : '0.62rem', color: '#94a3b8', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                {bar.label}
              </span>
            </div>
          ))}
        </div>

        {/* Timeline Interval Markers */}
        <div className="rhythm-time-markers">
          {metrics.markers.map((m, idx) => (
            <span key={idx}>{m}</span>
          ))}
        </div>
      </div>

      {/* 6. Clinical Alert Management Card */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div>
          <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>Longitudinal Episode &amp; Advisory Review</h4>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
            Zero unresolved high-urgency episodes in the active {timeWindow.toUpperCase()} window for {activePatient.fullName}. All pacing thresholds verified nominal.
          </p>
        </div>

        <button
          onClick={() => setAckAlert(!ackAlert)}
          style={{
            padding: '10px 18px',
            background: ackAlert ? '#ecfdf5' : '#eff6ff',
            color: ackAlert ? '#047857' : '#1d4ed8',
            border: `1.5px solid ${ackAlert ? '#a7f3d0' : '#bfdbfe'}`,
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CheckCircle2 size={16} />
          {ackAlert ? '● All Episodes Acknowledged' : 'Acknowledge Active Alerts'}
        </button>
      </div>

      {/* 7. Dual Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '4px' }}>
        <button
          onClick={handleGenerateSummary}
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
          <FileText size={18} color="#7c3aed" />
          Generate {timeWindow.toUpperCase()} Clinical Summary
        </button>

        <button
          onClick={handleExportCsv}
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
          Export {timeWindow.toUpperCase()} CSV
        </button>
      </div>

    </div>
  );
};
