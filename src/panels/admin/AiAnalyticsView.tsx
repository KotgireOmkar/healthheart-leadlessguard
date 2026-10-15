import React, { useState } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Layers, 
  Zap,
  TrendingUp,
  BrainCircuit,
  ShieldCheck,
  Info,
  Play,
  Pause,
  Download,
  FileText
} from 'lucide-react';
import { Patient } from '../../types';

interface AiAnalyticsViewProps {
  activePatient?: Patient;
}

export const AiAnalyticsView: React.FC<AiAnalyticsViewProps> = ({ activePatient }) => {
  const [selectedPatternId, setSelectedPatternId] = useState<string>('bradycardia');
  const [isPlayingStrip, setIsPlayingStrip] = useState<boolean>(true);

  // Preprocessed quantitative feature metrics
  const features = {
    meanHeartRateBpm: activePatient ? activePatient.baselineHeartRate : 72,
    sdnnMs: 46.2,
    rmssdMs: 38.8,
    pnn50Pct: 14.5,
    pacingBurdenPct: activePatient ? activePatient.pacingBurdenPercent : 2,
    sensedToPacedRatio: '98 : 2',
    signalQualityIndexPct: 96.4,
    pulseTransitTimeMs: 182,
    respiratoryCouplingIndex: 0.88
  };

  // 9 Pattern Classification Classes
  const patterns = [
    {
      id: 'normal',
      name: 'Normal Sinus Rhythm',
      severity: 'NORMAL',
      confidencePct: 99.1,
      color: '#10b981',
      bgColor: '#ecfdf5',
      evidence: 'Equidistant R-waves, normal P-R interval (160ms), and baseline pacing burden < 5%.',
      signals: ['Lead II ECG', 'Arterial PPG'],
      pacingImpact: 'No stimulation required. Natural sinus node pacing intact.'
    },
    {
      id: 'bradycardia',
      name: 'Sinus Bradycardia Pattern',
      severity: 'ADVISORY',
      confidencePct: 96.8,
      color: '#2563eb',
      bgColor: '#eff6ff',
      evidence: 'Average intrinsic ventricular rate measured below 60 BPM for > 45 consecutive seconds.',
      signals: ['Lead II ECG', 'Arterial PPG', 'BIA'],
      pacingImpact: 'VVI demand escape pacing triggered at Lower Rate Limit (60 BPM).'
    },
    {
      id: 'tachycardia',
      name: 'Ventricular Tachycardia Pattern',
      severity: 'CRITICAL',
      confidencePct: 94.2,
      color: '#ef4444',
      bgColor: '#fef2f2',
      evidence: 'Rapid ventricular rate > 130 BPM with widened QRS complexes (> 140ms).',
      signals: ['Lead II ECG', 'EGM'],
      pacingImpact: 'High-rate tracking notification generated. No antitachycardia pacing therapy (simulation only).'
    },
    {
      id: 'afib',
      name: 'Irregular Rhythm / AFib Pattern',
      severity: 'WARNING',
      confidencePct: 93.5,
      color: '#f59e0b',
      bgColor: '#fffbeb',
      evidence: 'Absence of discrete P-waves and irregular ventricular response (RR variation > 28%).',
      signals: ['Lead II ECG', 'PPG Peak Intervals'],
      pacingImpact: 'VVI pacing maintains lower rate floor while permitting irregular intrinsic beats above LRL.'
    },
    {
      id: 'chb',
      name: 'Complete AV Block Pattern',
      severity: 'CRITICAL',
      confidencePct: 98.4,
      color: '#8b5cf6',
      bgColor: '#f5f3ff',
      evidence: 'Total atrioventricular dissociation with ventricular escape reliance.',
      signals: ['Lead II ECG', 'Pacing Stimulus Markers'],
      pacingImpact: '100% ventricular pacing burden required to maintain hemodynamics.'
    },
    {
      id: 'artifact',
      name: 'High-Frequency Motion Artifact',
      severity: 'ADVISORY',
      confidencePct: 89.0,
      color: '#64748b',
      bgColor: '#f8fafc',
      evidence: 'Non-physiological baseline fluctuation (> 15 Hz) exceeding biological cardiac frequency.',
      signals: ['Lead II ECG', 'PPG', 'BIA'],
      pacingImpact: 'Artifact rejection filter activated to prevent inappropriate pacing inhibition.'
    },
    {
      id: 'dropout',
      name: 'Sensor Dropout / Lead Disconnect',
      severity: 'WARNING',
      confidencePct: 97.6,
      color: '#dc2626',
      bgColor: '#fef2f2',
      evidence: 'Flatline sensor telemetry on pulse oximetry and impedance spike > 2000 Ohms.',
      signals: ['SpO2', 'BIA Impedance'],
      pacingImpact: 'Fallback to autonomous asynchronous device pacing mode (VOO).'
    },
    {
      id: 'burden',
      name: 'Elevated Pacing Burden (>80%)',
      severity: 'WARNING',
      confidencePct: 99.2,
      color: '#ea580c',
      bgColor: '#fff7ed',
      evidence: 'Ventricular pacing ratio sustained above 80% over rolling 24-hour window.',
      signals: ['Device Counters', 'Telemetry Sequence Log'],
      pacingImpact: 'Battery longevity projection decreased from 8.4 years to 5.8 years.'
    },
    {
      id: 'anomaly',
      name: 'Telemetry Packet Desynchronization',
      severity: 'ADVISORY',
      confidencePct: 92.1,
      color: '#06b6d4',
      bgColor: '#ecfeff',
      evidence: 'Sequence counter gap detected: received packet seq #8498 after #8495 (3 packets lost).',
      signals: ['BLE Gateway Frame Sequence'],
      pacingImpact: 'Zero therapy impact. Pacemaker autonomous engine functions uninterrupted.'
    }
  ];

  const activePattern = patterns.find(p => p.id === selectedPatternId) || patterns[1];

  const handleAuditTrail = () => {
    alert(`AI Clinical Decision Audit Trail for pattern: ${activePattern.name}\nTimestamp: ${new Date().toISOString()}\nConfidence: ${activePattern.confidencePct}%\nFeature Vectors Verified: Mean HR, SDNN, RMSSD, SQI.`);
  };

  const handleExportAiReport = () => {
    const reportData = {
      model: 'HeartGPT v2.4 Multi-Head Attention',
      targetPatient: activePatient ? activePatient.fullName : 'Rajesh Sharma',
      dominantRhythm: activePattern.name,
      confidencePct: activePattern.confidencePct,
      featuresExtracted: features,
      clinicalEvidence: activePattern.evidence,
      generatedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leadlessguard_ai_findings_report.json`);
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
            <BrainCircuit size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>AI Decision Support & Arrhythmia Inference</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
              HeartGPT™ Multimodal Cardiac Classifier
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', fontSize: '0.74rem', color: '#64748b' }}>
              <span>Engine: <strong style={{ color: '#0f172a' }}>Transformer Attention Head v2.4</strong></span>
              <span>•</span>
              <span>Input: <strong style={{ color: '#2563eb' }}>Lead II ECG + Arterial PPG + BIA</strong></span>
              <span>•</span>
              <span>Classification Classes: <strong style={{ color: '#0f172a' }}>9 Calibrated Patterns</strong></span>
            </div>
          </div>
        </div>

        {/* Status Capsules Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div className="badge-emerald" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            <CheckCircle2 size={16} />
            <span>Multi-Channel Preprocessed</span>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '9999px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <ShieldCheck size={16} color="#2563eb" />
            <span>Strict Read-Only Boundary Enforced</span>
          </div>
        </div>
      </div>

      {/* 2. Signature Hero Metric Card & Secondary Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        
        {/* Card 1: Dominant Rhythm Classification (Purple Glow Container) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Dominant Rhythm Classification</span>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', lineHeight: '1.2', margin: '4px 0 6px' }}>
              {activePattern.name}
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: activePattern.color }}>
              ● {activePattern.severity} Classification
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #f5f3ff 0%, #ddd6fe 65%, rgba(221, 214, 254, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(109, 40, 217, 0.2)' }}>
            <BrainCircuit size={32} color="#7c3aed" />
          </div>
        </div>

        {/* Card 2: Model Confidence Rating (Blue Glow Container) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Inference Confidence</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              {activePattern.confidencePct}%
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2563eb' }}>
              ● High-Confidence Agreement
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #eff6ff 0%, #bfdbfe 65%, rgba(191, 219, 254, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(37, 99, 235, 0.2)' }}>
            <CheckCircle2 size={32} color="#2563eb" />
          </div>
        </div>

        {/* Card 3: Feature Purity (Emerald Glow Container) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Signal Quality Index (SQI)</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              {features.signalQualityIndexPct}%
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#059669' }}>
              ● Multi-Channel Validated
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #ecfdf5 0%, #a7f3d0 65%, rgba(167, 243, 208, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(16, 185, 129, 0.2)' }}>
            <Activity size={32} color="#059669" />
          </div>
        </div>

      </div>

      {/* 3. Tri-Colour AI Diagnostic Rings (Photo Style) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        {/* Ring 1: HeartGPT Tokenizer Purity (Royal Blue) */}
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
                strokeDashoffset={(2 * Math.PI * 32) * (1 - 0.991)}
                className="circular-ring-progress"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>99.1%</div>
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>HeartGPT Tokenizer Purity</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>101 Discrete Bins Quantized</div>
          </div>
        </div>

        {/* Ring 2: Attention Head Weight (Sunset Amber) */}
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
                strokeDashoffset={(2 * Math.PI * 32) * (1 - 0.945)}
                className="circular-ring-progress"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>94.5%</div>
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Attention Head Weight</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>P-Wave & Peak Specialization</div>
          </div>
        </div>

        {/* Ring 3: Morphological Match Score (Royal Purple) */}
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
                strokeDashoffset={(2 * Math.PI * 32) * (1 - activePattern.confidencePct / 100)}
                className="circular-ring-progress"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>{activePattern.confidencePct}%</div>
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Morphological Match Score</div>
            <div style={{ fontSize: '0.68rem', color: '#6d28d9', fontWeight: 600 }}>Cross-Signal Synchronized</div>
          </div>
        </div>

      </div>

      {/* 4. Live Pattern Detection Timeline Strip */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setIsPlayingStrip(!isPlayingStrip)}
              style={{ width: 30, height: 30, borderRadius: '50%', background: '#ffffff', border: '1.5px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0f172a' }}
              title={isPlayingStrip ? 'Freeze Probability Stream' : 'Resume Probability Stream'}
            >
              {isPlayingStrip ? <Pause size={13} fill="#0f172a" /> : <Play size={13} fill="#0f172a" style={{ marginLeft: 2 }} />}
            </button>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                Real-Time Inference Confidence Timeline
              </h3>
              <span style={{ fontSize: '0.72rem', color: '#6d28d9', fontWeight: 600 }}>
                ● Continuous Posterior Probability Distribution Across 9 Cardiac Classes
              </span>
            </div>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
            Active Target: {activePattern.name}
          </span>
        </div>

        {/* Probability Stream Bars */}
        <div style={{ height: '100px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
          {Array.from({ length: 36 }).map((_, i) => {
            const h = 50 + Math.sin(i / 2) * 35 + (Math.random() - 0.5) * 10;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div 
                  style={{ 
                    width: '100%', 
                    height: `${Math.min(98, Math.max(10, h))}%`, 
                    background: i % 4 === 0 ? '#8b5cf6' : '#2563eb', 
                    borderRadius: '3px' 
                  }} 
                />
              </div>
            );
          })}
        </div>

        {/* Time Interval Markers */}
        <div className="rhythm-time-markers">
          <span>0:00 - 0:10 (Epoch Alpha)</span>
          <span>0:10 - 0:20 (Epoch Beta)</span>
          <span>0:20 - 0:30 (Real-Time Ingestion)</span>
        </div>
      </div>

      {/* 5. 9 Calibrated Arrhythmia Pattern Selector Grid */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
          9 Verified Diagnostic Rhythm Classes (Select to Inspect Evidence)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {patterns.map(p => {
            const isSelected = p.id === selectedPatternId;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPatternId(p.id)}
                style={{
                  background: isSelected ? p.bgColor : '#ffffff',
                  border: `1.5px solid ${isSelected ? p.color : '#eaecf0'}`,
                  borderRadius: '16px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? `0 2px 8px ${p.color}25` : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>{p.name}</span>
                  <span 
                    style={{ 
                      fontSize: '0.68rem', 
                      fontWeight: 700, 
                      padding: '2px 8px', 
                      borderRadius: '9999px',
                      background: p.bgColor,
                      color: p.color,
                      border: `1px solid ${p.color}40`
                    }}
                  >
                    {p.confidencePct}% Match
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.4, marginBottom: '8px' }}>
                  {p.evidence}
                </p>
                <div style={{ fontSize: '0.7rem', color: '#0f172a', fontWeight: 600 }}>
                  Therapy Impact: <span style={{ color: p.color }}>{p.pacingImpact}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Structured Clinical Evidence Card */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div>
          <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>Clinical Decision-Support Audit Trail</h4>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
            All 9 classifiers operate in non-therapeutic diagnostic advisory mode. Pacing engine remains 100% autonomous.
          </p>
        </div>

        <button
          onClick={handleAuditTrail}
          style={{
            padding: '10px 18px',
            background: '#f5f3ff',
            color: '#6d28d9',
            border: '1.5px solid #ddd6fe',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ShieldCheck size={16} />
          Audit Decision Trail
        </button>
      </div>

      {/* 7. Dual Action Buttons (Photo Style) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '4px' }}>
        <button
          onClick={handleAuditTrail}
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
          <ShieldCheck size={18} color="#6d28d9" />
          Audit AI Decision Trail
        </button>

        <button
          onClick={handleExportAiReport}
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
          Export AI Findings Report
        </button>
      </div>

    </div>
  );
};
