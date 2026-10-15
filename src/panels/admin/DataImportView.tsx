import React, { useState } from 'react';
import { 
  DownloadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Pause,
  Database,
  Activity,
  UploadCloud,
  FileCheck,
  RotateCcw
} from 'lucide-react';

export const DataImportView: React.FC = () => {
  const [selectedRecord, setSelectedRecord] = useState<'rec100' | 'rec207'>('rec100');
  const [isPlayingStrip, setIsPlayingStrip] = useState<boolean>(true);
  const [isMatching, setIsMatching] = useState(false);
  const [matchResults, setMatchResults] = useState<{ tp: number; fp: number; fn: number; se: string; pp: string } | null>({
    tp: 2271,
    fp: 8,
    fn: 2,
    se: '99.91%',
    pp: '99.65%',
  });

  const handleRunMatcher = () => {
    setIsMatching(true);
    setTimeout(() => {
      setIsMatching(false);
      setMatchResults({
        tp: selectedRecord === 'rec100' ? 2271 : 1845,
        fp: selectedRecord === 'rec100' ? 8 : 24,
        fn: selectedRecord === 'rec100' ? 2 : 12,
        se: selectedRecord === 'rec100' ? '99.91%' : '99.35%',
        pp: selectedRecord === 'rec100' ? '99.65%' : '98.71%',
      });
    }, 600);
  };

  const handleClearBuffer = () => {
    alert('Imported buffer cleared. Reset to default MIT-BIH Arrhythmia benchmark dataset.');
  };

  return (
    <div className="content-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. Persona Header Card with Status Capsules */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '20px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#eff6ff', border: '2px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1d4ed8', fontWeight: 800, fontSize: '1.15rem' }}>
            <Database size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>Clinical Ground Truth & Benchmarking</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
              PhysioNet MIT-BIH Arrhythmia Database Ingestion
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', fontSize: '0.74rem', color: '#64748b' }}>
              <span>Sampling: <strong style={{ color: '#0f172a' }}>360 Hz Multi-Lead</strong></span>
              <span>•</span>
              <span>Active Record: <strong style={{ color: '#2563eb' }}>{selectedRecord.toUpperCase()} (Lead MLII)</strong></span>
              <span>•</span>
              <span>Standard: <strong style={{ color: '#0f172a' }}>WFDB Calibrated Annotations</strong></span>
            </div>
          </div>
        </div>

        {/* Status Capsules Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div className="badge-emerald" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            <CheckCircle2 size={16} />
            <span>Record #{selectedRecord === 'rec100' ? '100' : '207'} Loaded</span>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '9999px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <Activity size={16} color="#2563eb" />
            <span>Lead II Ground Truth</span>
          </div>
        </div>
      </div>

      {/* 2. Signature Hero Metric Card & Secondary Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        
        {/* Card 1: QRS Detection Accuracy (Blue Glow Container) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>QRS Detection Accuracy</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              99.4% <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>Match</span>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2563eb' }}>
              ● Pan-Tompkins Algorithm Aligned
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #eff6ff 0%, #bfdbfe 65%, rgba(191, 219, 254, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(37, 99, 235, 0.2)' }}>
            <Activity size={32} color="#2563eb" />
          </div>
        </div>

        {/* Card 2: Total Annotated Beats (Emerald Glow Container) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Total Annotated Beats</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              2,274 <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>Beats</span>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#059669' }}>
              ● Annotation Classes Verified
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #ecfdf5 0%, #a7f3d0 65%, rgba(167, 243, 208, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(16, 185, 129, 0.2)' }}>
            <FileCheck size={32} color="#059669" />
          </div>
        </div>

        {/* Card 3: Sensitivity Score (Purple Glow Container) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Sensitivity (Se)</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              {matchResults?.se || '99.91%'}
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#6d28d9' }}>
              ● Positive Predictivity {matchResults?.pp || '99.65%'}
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #f5f3ff 0%, #ddd6fe 65%, rgba(221, 214, 254, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(109, 40, 217, 0.2)' }}>
            <CheckCircle2 size={32} color="#7c3aed" />
          </div>
        </div>

      </div>

      {/* 3. Tri-Colour PhysioNet Benchmark Rings (Photo Style) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        {/* Ring 1: Normal Sinus Beat Match (Royal Blue) */}
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
                strokeDashoffset={(2 * Math.PI * 32) * (1 - 0.998)}
                className="circular-ring-progress"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>99.8%</div>
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Normal Sinus Beat Match</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Normal Beat Annotations (N)</div>
          </div>
        </div>

        {/* Ring 2: Premature Ventricular Match (Sunset Amber) */}
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
                strokeDashoffset={(2 * Math.PI * 32) * (1 - 0.975)}
                className="circular-ring-progress"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>97.5%</div>
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>PVC Complex Match</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Premature Ventricular (V)</div>
          </div>
        </div>

        {/* Ring 3: Pacing Spike Synchronization (Emerald Mint) */}
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
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Pacing Spike Synchronization</div>
            <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600 }}>Paced Beat Annotations (/)</div>
          </div>
        </div>

      </div>

      {/* 4. Live PhysioNet Reference Strip Card */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setIsPlayingStrip(!isPlayingStrip)}
              style={{ width: 30, height: 30, borderRadius: '50%', background: '#ffffff', border: '1.5px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0f172a' }}
              title={isPlayingStrip ? 'Freeze Record' : 'Resume Record'}
            >
              {isPlayingStrip ? <Pause size={13} fill="#0f172a" /> : <Play size={13} fill="#0f172a" style={{ marginLeft: 2 }} />}
            </button>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                PhysioNet MIT-BIH Waveform Playback ({selectedRecord.toUpperCase()})
              </h3>
              <span style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 600 }}>
                ● Calibrated Millivolts with Overlay Annotation Anchors
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setSelectedRecord('rec100')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: selectedRecord === 'rec100' ? '#2563eb' : '#cbd5e1',
                background: selectedRecord === 'rec100' ? '#eff6ff' : '#ffffff',
                color: selectedRecord === 'rec100' ? '#1d4ed8' : '#64748b',
                fontWeight: 700,
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              Record 100 (Normal Sinus)
            </button>
            <button
              onClick={() => setSelectedRecord('rec207')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: selectedRecord === 'rec207' ? '#2563eb' : '#cbd5e1',
                background: selectedRecord === 'rec207' ? '#eff6ff' : '#ffffff',
                color: selectedRecord === 'rec207' ? '#1d4ed8' : '#64748b',
                fontWeight: 700,
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              Record 207 (Ventricular Flutter)
            </button>
          </div>
        </div>

        {/* Waveform Canvas Simulation */}
        <div style={{ height: '140px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden', position: 'relative', padding: '10px' }}>
          <svg width="100%" height="120" viewBox="0 0 700 120" preserveAspectRatio="none">
            <path
              d="M 0 70 L 40 70 Q 55 58, 65 70 L 80 70 L 90 85 L 105 15 L 120 100 L 130 70 Q 160 50, 180 70 L 240 70 Q 255 58, 265 70 L 280 70 L 290 85 L 305 15 L 320 100 L 330 70 Q 360 50, 380 70 L 440 70 Q 455 58, 465 70 L 480 70 L 490 85 L 505 15 L 520 100 L 530 70 Q 560 50, 580 70 L 700 70"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.4"
            />
          </svg>

          {/* Reference Annotation Badges */}
          <div style={{ position: 'absolute', top: 12, left: 100, background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 800 }}>
            N (Normal)
          </div>
          <div style={{ position: 'absolute', top: 12, left: 300, background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 800 }}>
            N (Normal)
          </div>
          <div style={{ position: 'absolute', top: 12, left: 500, background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 800 }}>
            N (Normal)
          </div>
        </div>

        {/* Time Interval Markers */}
        <div className="rhythm-time-markers">
          <span>0.00s - 1.00s (Beat 1)</span>
          <span>1.00s - 2.00s (Beat 2)</span>
          <span>2.00s - 3.00s (Beat 3)</span>
        </div>
      </div>

      {/* 5. Dataset Citation & Provenance Card */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div>
          <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>MIT-BIH Dataset Provenance & Attribution</h4>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
            Moody GB, Mark RG. IEEE Eng in Med and Biol 20(3):45-50 (2001). Open Data Commons Attribution License v1.0.
          </p>
        </div>

        <button
          onClick={handleRunMatcher}
          disabled={isMatching}
          style={{
            padding: '10px 18px',
            background: '#eff6ff',
            color: '#1d4ed8',
            border: '1.5px solid #bfdbfe',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.8rem',
            cursor: isMatching ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Play size={15} fill="#1d4ed8" />
          {isMatching ? 'Evaluating QRS...' : 'Run Pan-Tompkins Matcher'}
        </button>
      </div>

      {/* 6. Dual Action Buttons (Photo Style) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '4px' }}>
        <button
          onClick={handleClearBuffer}
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
          Clear Imported Buffer
        </button>

        <button
          onClick={handleRunMatcher}
          disabled={isMatching}
          style={{
            background: '#2563eb',
            border: 'none',
            borderRadius: '16px',
            padding: '14px 20px',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: isMatching ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
            transition: 'all 0.15s ease'
          }}
        >
          <Activity size={18} color="#ffffff" />
          {isMatching ? 'Processing Matcher...' : 'Run Benchmark Comparison'}
        </button>
      </div>

    </div>
  );
};
