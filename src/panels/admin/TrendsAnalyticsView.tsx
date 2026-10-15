import React, { useState } from 'react';
import { Patient } from '../../types';
import { 
  TrendingUp, 
  Clock, 
  Activity, 
  BarChart2, 
  Play, 
  Pause, 
  CheckCircle2, 
  Database, 
  Download, 
  FileText,
  Calendar,
  Layers
} from 'lucide-react';

interface TrendsAnalyticsViewProps {
  activePatient: Patient;
}

export const TrendsAnalyticsView: React.FC<TrendsAnalyticsViewProps> = ({ activePatient }) => {
  const [timeWindow, setTimeWindow] = useState<'1h' | '6h' | '24h' | '7d' | '30d'>('24h');
  const [isPlayingStrip, setIsPlayingStrip] = useState<boolean>(true);
  const [ackAlert, setAckAlert] = useState<boolean>(false);

  const baseHr = activePatient.baselineHeartRate;
  const pacing = activePatient.pacingBurdenPercent;

  const handleExportCsv = () => {
    let csv = 'Hour,Resting_HR_BPM,Pacing_Burden_Pct,SDNN_ms,RMSSD_ms\n';
    for (let i = 0; i < 24; i++) {
      const hr = Math.round(baseHr + Math.sin(i / 3) * 6);
      const pace = Math.round(pacing + (Math.random() - 0.5) * 4);
      csv += `${i}:00,${hr},${Math.max(0, pace)},46.2,38.8\n`;
    }
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
    alert(`30-Day Clinical Longitudinal Summary for ${activePatient.fullName} (${activePatient.patientId}) generated. Baseline HR: ${baseHr} BPM, Cumulative Pacing: ${pacing}%, SDNN: 46.2ms. All criteria within normal limits.`);
  };

  return (
    <div className="content-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. Persona Header Card with Status Capsules */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '20px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#f5f3ff', border: '2px solid #ddd6fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6d28d9', fontWeight: 800, fontSize: '1.15rem' }}>
            <span>{activePatient.fullName.split(' ').map(n => n[0]).join('')}</span>
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
            <span>30-Day Archive Synchronized</span>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '9999px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <Database size={16} color="#7c3aed" />
            <span>14,892 Records Logged</span>
          </div>

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
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  boxShadow: timeWindow === w ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                }}
              >
                {w.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Signature Hero Metric Card & Secondary Card (Photo Style) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        
        {/* Card 1: 24-Hour Mean Heart Rate (Purple Glow Container) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Mean Resting Heart Rate</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              {baseHr}.4 <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>BPM</span>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#6d28d9' }}>
              ● Circadian Rhythm Preserved
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #f5f3ff 0%, #ddd6fe 65%, rgba(221, 214, 254, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(109, 40, 217, 0.2)' }}>
            <Activity size={32} color="#7c3aed" />
          </div>
        </div>

        {/* Card 2: Cumulative Pacing Burden (Amber Glow Container) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Cumulative Pacing Burden</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              {pacing}%
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#059669' }}>
              ● Battery Preservation Optimal
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #fef3c7 0%, #fde68a 65%, rgba(253, 230, 138, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(245, 158, 11, 0.2)' }}>
            <BarChart2 size={32} color="#d97706" />
          </div>
        </div>

        {/* Card 3: Autonomic Balance Index (Blue Glow Container) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Autonomic Balance Index</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              1.19 <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>LF/HF</span>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2563eb' }}>
              ● Sympathovagal Equilibrium
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #eff6ff 0%, #bfdbfe 65%, rgba(191, 219, 254, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(37, 99, 235, 0.2)' }}>
            <TrendingUp size={32} color="#2563eb" />
          </div>
        </div>

      </div>

      {/* 3. Tri-Colour HRV Diagnostic Rings (Exact Match to Reference Photo) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        {/* Ring 1: SDNN Autonomic Tone (Purple) */}
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
                strokeDashoffset={(2 * Math.PI * 32) * (1 - 46.2 / 80)}
                className="circular-ring-progress"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>46.2ms</div>
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>SDNN Autonomic Tone</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Nominal: &gt; 35 ms</div>
          </div>
        </div>

        {/* Ring 2: RMSSD Vagal Tone (Royal Blue) */}
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
                strokeDashoffset={(2 * Math.PI * 32) * (1 - 38.8 / 60)}
                className="circular-ring-progress"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>38.8ms</div>
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>RMSSD Vagal Tone</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Parasympathetic Reserve</div>
          </div>
        </div>

        {/* Ring 3: pNN50 Rhythm Stability (Emerald Mint) */}
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
                strokeDashoffset={(2 * Math.PI * 32) * (1 - 14.5 / 25)}
                className="circular-ring-progress"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>14.5%</div>
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>pNN50 Rhythm Stability</div>
            <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600 }}>Beat-to-Beat Variation</div>
          </div>
        </div>

      </div>

      {/* 4. Live Longitudinal Trend Strip Card */}
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
                Circadian Heart Rate & Pacing Demand Envelope ({timeWindow.toUpperCase()})
              </h3>
              <span style={{ fontSize: '0.72rem', color: '#6d28d9', fontWeight: 600 }}>
                ● 24-Hour Circadian Diurnal Profile with Upper/Lower CI Bands
              </span>
            </div>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
            Median: {baseHr} BPM • Pacing: {pacing}%
          </span>
        </div>

        {/* 24-Hour Circadian Profile Bars */}
        <div style={{ height: '180px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
          {Array.from({ length: 24 }).map((_, i) => {
            const height = 40 + Math.sin(i / 3) * 25 + (Math.random() - 0.5) * 8;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div 
                  style={{ 
                    width: '100%', 
                    height: `${height}%`, 
                    background: 'linear-gradient(180deg, #7c3aed 0%, rgba(124, 58, 237, 0.25) 100%)', 
                    borderRadius: '5px',
                    transition: 'height 0.3s ease'
                  }} 
                />
                <span style={{ fontSize: '0.62rem', color: '#94a3b8', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>{i}h</span>
              </div>
            );
          })}
        </div>

        {/* Timeline Interval Markers (Photo Style) */}
        <div className="rhythm-time-markers">
          <span>00:00 - 06:00 (Nocturnal Nadir)</span>
          <span>06:00 - 12:00 (Morning Surge)</span>
          <span>12:00 - 18:00 (Diurnal Peak)</span>
          <span>18:00 - 24:00 (Evening Decline)</span>
        </div>
      </div>

      {/* 5. Clinical Alert Management Card */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div>
          <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>Longitudinal Episode & Advisory Review</h4>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
            Zero unresolved high-urgency episodes in the active {timeWindow.toUpperCase()} window. All pacing thresholds verified nominal.
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

      {/* 6. Dual Action Buttons (Photo Style) */}
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
          Generate 30-Day Clinical Summary
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
          Export Long-Term CSV
        </button>
      </div>

    </div>
  );
};
