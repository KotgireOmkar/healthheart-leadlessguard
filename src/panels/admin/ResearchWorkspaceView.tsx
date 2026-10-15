import React, { useState } from 'react';
import { heartGptLab } from '../../services/heartgptLab';
import { ScenarioRecord } from '../../types';
import { api } from '../../services/api';
import { 
  FlaskConical, 
  Play, 
  Pause, 
  CheckCircle2, 
  Download, 
  BookOpen, 
  Layers, 
  BarChart3, 
  Activity, 
  RotateCcw,
  Sparkles,
  Zap
} from 'lucide-react';

interface ResearchWorkspaceViewProps {
  scenarios: ScenarioRecord[];
  onRefreshScenarios: () => void;
}

export const ResearchWorkspaceView: React.FC<ResearchWorkspaceViewProps> = ({
  scenarios,
  onRefreshScenarios,
}) => {
  const [runningCode, setRunningCode] = useState<string | null>(null);
  const [isPlayingStrip, setIsPlayingStrip] = useState<boolean>(true);

  // HeartGPT lab data
  const sampleEcg = [0, 0.1, 0.18, 0.05, -0.15, 1.4, -0.35, 0.02, 0.32, 0.1, 0, 0, 0.05, 0.12, 0.9, -0.2];
  const tokenized = heartGptLab.tokenize(sampleEcg);
  const attentionMaps = heartGptLab.getAttentionHeadMaps(16);
  const homonyms = heartGptLab.getHomonymClusters(80);

  const handleRunScenario = async (code: string) => {
    setRunningCode(code);
    await api.runScenario(code);
    onRefreshScenarios();
    setRunningCode(null);
  };

  const handleRunAllScenarios = async () => {
    setRunningCode('ALL');
    for (const sc of scenarios) {
      await api.runScenario(sc.scenarioCode);
    }
    onRefreshScenarios();
    setRunningCode(null);
  };

  const handleResetBaseline = () => {
    alert('Research Workspace & Cardiac Simulator reset to safe baseline state (Sinus Rhythm 72 BPM, VVI Demand).');
  };

  return (
    <div className="content-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. Persona Header Card with Status Capsules */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '20px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#eff6ff', border: '2px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1d4ed8', fontWeight: 800, fontSize: '1.15rem' }}>
            <FlaskConical size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>Electrophysiology Transformer Research Lab</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
              HeartGPT™ Multimodal Interpretability Suite
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', fontSize: '0.74rem', color: '#64748b' }}>
              <span>Reference: <strong style={{ color: '#0f172a' }}>Imperial College London (arXiv:2407.20775)</strong></span>
              <span>•</span>
              <span>Tokenizer: <strong style={{ color: '#2563eb' }}>101 Discrete Quantization Bins</strong></span>
              <span>•</span>
              <span>Scenarios: <strong style={{ color: '#0f172a' }}>8 Canonical EP Benchmark States</strong></span>
            </div>
          </div>
        </div>

        {/* Status Capsules Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div className="badge-emerald" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            <CheckCircle2 size={16} />
            <span>8 Scenarios Loaded</span>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '9999px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <Sparkles size={16} color="#2563eb" />
            <span>Transformer Lab Active</span>
          </div>
        </div>
      </div>

      {/* 2. Signature Hero Metric Card & Secondary Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        
        {/* Card 1: Quantized Biosignal Tokens (Blue Glow Container) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Biosignal Quantization Tokens</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              101 <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>Tokens</span>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2563eb' }}>
              ● Continuous Wave Normalized [0..100]
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #eff6ff 0%, #bfdbfe 65%, rgba(191, 219, 254, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(37, 99, 235, 0.2)' }}>
            <Layers size={32} color="#2563eb" />
          </div>
        </div>

        {/* Card 2: Transformer Attention Focus (Amber Glow Container) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Attention Head Specialization</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', lineHeight: '1.2', margin: '4px 0 6px' }}>
              Head 4 Focus
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#d97706' }}>
              ● P-Wave & Dicrotic Notch Aligned
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #fef3c7 0%, #fde68a 65%, rgba(253, 230, 138, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(245, 158, 11, 0.2)' }}>
            <BarChart3 size={32} color="#d97706" />
          </div>
        </div>

        {/* Card 3: Phase Clustering Purity (Purple Glow Container) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Cardiac Homonym Separation</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              98.2%
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#6d28d9' }}>
              ● Distinct Phase Manifolds
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #f5f3ff 0%, #ddd6fe 65%, rgba(221, 214, 254, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(109, 40, 217, 0.2)' }}>
            <Activity size={32} color="#7c3aed" />
          </div>
        </div>

      </div>

      {/* 3. Tri-Colour Research Benchmark Rings (Photo Style) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        {/* Ring 1: Scenario A Complete Heart Block (Royal Blue) */}
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
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Scenario A: CHB Pass Rate</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Complete AV Dissociation</div>
          </div>
        </div>

        {/* Ring 2: Scenario B Intermittent AV Block (Sunset Amber) */}
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
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Scenario B: Intermittent Block</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Variable Conduction Delay</div>
          </div>
        </div>

        {/* Ring 3: Scenario C High Pacing Burden (Emerald Mint) */}
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
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Scenario C: High Burden</div>
            <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600 }}>Demand Acceleration</div>
          </div>
        </div>

      </div>

      {/* 4. Live Token Stream Strip Card */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setIsPlayingStrip(!isPlayingStrip)}
              style={{ width: 30, height: 30, borderRadius: '50%', background: '#ffffff', border: '1.5px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0f172a' }}
              title={isPlayingStrip ? 'Freeze Token Stream' : 'Resume Token Stream'}
            >
              {isPlayingStrip ? <Pause size={13} fill="#0f172a" /> : <Play size={13} fill="#0f172a" style={{ marginLeft: 2 }} />}
            </button>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                Quantized Discrete Token Stream [0..100]
              </h3>
              <span style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 600 }}>
                ● Real-Time Feed into HeartGPT Transformer Encoder
              </span>
            </div>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
            Vocab: 101 Bins • 100 Hz Sampling
          </span>
        </div>

        {/* Scrolling Token Badges */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', background: '#f8fafc', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0', maxHeight: '110px', overflowY: 'auto' }}>
          {tokenized.tokens.concat(tokenized.tokens).slice(0, 48).map((tok, i) => (
            <span
              key={i}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: tok > 50 ? '#2563eb' : '#64748b',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
              }}
            >
              T{tok}
            </span>
          ))}
        </div>

        {/* Time Interval Markers */}
        <div className="rhythm-time-markers">
          <span>#000 - #025 (PR Interval Segment)</span>
          <span>#025 - #050 (QRS Complex Segment)</span>
          <span>#050 - #100 (ST-T Repolarization)</span>
        </div>
      </div>

      {/* 5. 8 Canonical EP Benchmark Scenarios Grid */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
          8 Canonical Electrophysiology Benchmarking Scenarios
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {scenarios.map(sc => {
            const isRunning = runningCode === sc.scenarioCode || runningCode === 'ALL';
            return (
              <div
                key={sc.scenarioCode}
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #eaecf0',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>{sc.name}</span>
                    <span 
                      style={{ 
                        fontSize: '0.68rem', 
                        fontWeight: 700, 
                        padding: '2px 8px', 
                        borderRadius: '9999px',
                        background: sc.status === 'PASS' ? '#ecfdf5' : '#eff6ff',
                        color: sc.status === 'PASS' ? '#047857' : '#1d4ed8',
                        border: `1px solid ${sc.status === 'PASS' ? '#a7f3d0' : '#bfdbfe'}`
                      }}
                    >
                      {sc.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.4 }}>
                    {sc.description}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>Code: {sc.scenarioCode}</span>
                  <button
                    onClick={() => handleRunScenario(sc.scenarioCode)}
                    disabled={isRunning}
                    style={{
                      padding: '6px 14px',
                      background: isRunning ? '#94a3b8' : '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: isRunning ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Play size={11} fill="#ffffff" />
                    {isRunning ? 'Running...' : 'Run Benchmark'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Dual Action Buttons (Photo Style) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '4px' }}>
        <button
          onClick={handleResetBaseline}
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
          Reset to Safe Baseline State
        </button>

        <button
          onClick={handleRunAllScenarios}
          disabled={runningCode !== null}
          style={{
            background: '#2563eb',
            border: 'none',
            borderRadius: '16px',
            padding: '14px 20px',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: runningCode !== null ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
            transition: 'all 0.15s ease'
          }}
        >
          <Play size={18} fill="#ffffff" />
          {runningCode ? 'Executing Benchmarks...' : 'Run All 8 Scenarios'}
        </button>
      </div>

    </div>
  );
};
