import React, { useState } from 'react';
import { Patient, ClinicalAlert } from '../../types';
import { ECGCanvas } from '../../components/ECGCanvas';
import { simulator } from '../../services/signalGenerators';
import { 
  Heart, 
  Activity, 
  Battery, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  TrendingUp, 
  DownloadCloud, 
  FlaskConical, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  Clock,
  Play,
  Pause,
  Bell,
  Lock,
  Layers
} from 'lucide-react';
import { AdminTab } from '../../components/Sidebar';

interface AdminDashboardProps {
  patients: Patient[];
  activePatient: Patient;
  onSelectPatient: (patient: Patient) => void;
  alerts: ClinicalAlert[];
  onNavigateTab: (tab: AdminTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  patients,
  activePatient,
  onSelectPatient,
  alerts,
  onNavigateTab,
}) => {
  const [activeSignalTab, setActiveSignalTab] = useState<'ECG' | 'PPG' | 'SpO2' | 'BIA'>('ECG');
  const [isPlayingStrip, setIsPlayingStrip] = useState<boolean>(true);

  // Update simulator parameters for active patient
  simulator.setPatientParameters(
    activePatient.baselineHeartRate,
    activePatient.pacingBurdenPercent,
    activePatient.patientId === 'PAT-005' ? 0.08 : 0.02
  );
  const waveformData = simulator.generateBuffer(10);

  return (
    <div className="content-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. Patient Switcher Tabs Bar */}
      <div className="patient-tabs-bar">
        {patients.map(p => (
          <button
            key={p.patientId}
            className={`patient-tab-btn ${activePatient.patientId === p.patientId ? 'active' : ''}`}
            onClick={() => onSelectPatient(p)}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.telemetryStatus === 'ONLINE' ? '#10b981' : '#f59e0b' }} />
            <div>
              <span className="tab-id">{p.patientId}</span> • <span className="tab-name">{p.fullName}</span>
            </div>
          </button>
        ))}
      </div>

      {/* 2. Persona Header Card (Photo Match Design) */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '20px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#dbeafe', border: '2px solid #93c5fd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e40af', fontWeight: 800, fontSize: '1.15rem' }}>
            <span>{activePatient.fullName.split(' ').map(n => n[0]).join('')}</span>
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>Active Patient Session</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>{activePatient.fullName}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', fontSize: '0.74rem', color: '#64748b' }}>
              <span>ID: <strong style={{ color: '#0f172a' }}>{activePatient.patientId}</strong></span>
              <span>•</span>
              <span>Device: <strong style={{ color: '#0f172a' }}>{activePatient.deviceModel}</strong> ({activePatient.serialNumber})</span>
              <span>•</span>
              <span>Mode: <strong style={{ color: '#2563eb' }}>VVI Demand ({activePatient.lowerRateLimit} BPM)</strong></span>
            </div>
          </div>
        </div>

        {/* Status Capsules Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="badge-emerald" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            <CheckCircle2 size={16} />
            <span>Telemetry Uplink Active</span>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '9999px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <Battery size={16} color="#059669" />
            <span>{activePatient.batteryLongevityYears} Years Remaining</span>
          </div>
        </div>
      </div>

      {/* 3. Vitals Metric Grid (4 Photo-Matched Cards with Glowing Radial Containers) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        
        {/* Card 1: Heart Rate (Red Glow Container) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Heart Rate</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              {activePatient.baselineHeartRate} <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>BPM</span>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#059669' }}>
              ● Rhythm Steady & Protected
            </span>
          </div>
          <div className="radial-heart-glow">
            <Heart size={34} color="#ef4444" fill="#ef4444" className="beating-heart-icon" />
          </div>
        </div>

        {/* Card 2: Pacing Demand Burden (Amber Glow Container) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Pacing Demand</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              {activePatient.pacingBurdenPercent}%
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: activePatient.pacingBurdenPercent > 50 ? '#d97706' : '#059669' }}>
              {activePatient.pacingBurdenPercent > 50 ? '● High Pacing Support' : '● Normal Intrinsic Range'}
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #fef3c7 0%, #fde68a 65%, rgba(253, 230, 138, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(245, 158, 11, 0.2)' }}>
            <Activity size={32} color="#d97706" />
          </div>
        </div>

        {/* Card 3: Battery Longevity (Emerald Glow Container) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Battery Longevity</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              {activePatient.batteryPercentage}%
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#059669' }}>
              ● ~{activePatient.batteryLongevityYears} Years Remaining
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #ecfdf5 0%, #a7f3d0 65%, rgba(167, 243, 208, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(16, 185, 129, 0.2)' }}>
            <Battery size={32} color="#059669" />
          </div>
        </div>

        {/* Card 4: Device Status (Blue Glow Container) */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Device Integrity</span>
            <div style={{ fontSize: '2.3rem', fontWeight: 800, color: activePatient.telemetryStatus === 'ONLINE' ? '#10b981' : '#f59e0b', lineHeight: '1.1', margin: '4px 0 6px' }}>
              {activePatient.telemetryStatus === 'ONLINE' ? 'Normal' : 'Advisory'}
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2563eb' }}>
              ● All Systems Protected
            </span>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle, #eff6ff 0%, #bfdbfe 65%, rgba(191, 219, 254, 0.25) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(37, 99, 235, 0.2)' }}>
            <ShieldCheck size={32} color="#2563eb" />
          </div>
        </div>

      </div>

      {/* 4. Tri-Colour Clinical Diagnostic Rings (3 Equal Cards Matching Photo Layout) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        {/* Ring 1: Intrinsic R-Wave Amplitude (Royal Blue) */}
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
                strokeDashoffset={(2 * Math.PI * 32) * (1 - Math.min(1, activePatient.rWaveAmplitudeMv / 15))}
                className="circular-ring-progress"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>{activePatient.rWaveAmplitudeMv}mV</div>
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Intrinsic R-Wave Amplitude</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Target: &gt; 1.0 mV</div>
          </div>
        </div>

        {/* Ring 2: Bipolar Lead Impedance (Sunset Amber) */}
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
                strokeDashoffset={(2 * Math.PI * 32) * (1 - activePatient.leadImpedanceOhms / 1500)}
                className="circular-ring-progress"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>{activePatient.leadImpedanceOhms}Ω</div>
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Bipolar Lead Impedance</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Nominal: 400 - 1000 Ω</div>
          </div>
        </div>

        {/* Ring 3: Signal Quality Index SQI (Emerald Mint) */}
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
                strokeDashoffset={(2 * Math.PI * 32) * (1 - activePatient.signalQualityIndex / 100)}
                className="circular-ring-progress"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>{activePatient.signalQualityIndex}%</div>
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Signal Quality Index (SQI)</div>
            <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600 }}>Telemetry Validated</div>
          </div>
        </div>

      </div>

      {/* 5. Main 2-Column Split (Live Oscilloscope + Device Overview / Alerts) */}
      <div className="dashboard-main-split">
        
        {/* Left Column: Live Biosignals Oscilloscope Card */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
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
                  Live Telemetry Oscilloscope
                </h3>
                <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>
                  ● 250 Hz Continuous Intracardiac Stream
                </span>
              </div>
            </div>

            {/* Signal Tabs */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['ECG', 'PPG', 'SpO2', 'BIA'] as const).map(tab => (
                <button
                  key={tab}
                  className={`signal-color-pill ${tab.toLowerCase()}-pill ${activeSignalTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveSignalTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Canvas Waveform */}
          <ECGCanvas
            data={waveformData}
            leadName={activeSignalTab === 'ECG' ? 'Lead II (Intracardiac EGM)' : `${activeSignalTab} Continuous Telemetry`}
            height={220}
            showCalipers={true}
          />

          {/* Bottom Time Interval Range Markers */}
          <div className="rhythm-time-markers" style={{ padding: '0 10px' }}>
            <span>0:00 - 0:10</span>
            <span>0:00 - 0:10 seconds</span>
            <span>0:20 - 0:30</span>
          </div>

          {/* Bottom Waveform Badges */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '6px' }}>
            <span className="badge-blue">
              <Activity size={13} />
              ECG: 25 mm/s | 10 mm/mV
            </span>
            <span className="badge-emerald">
              <CheckCircle2 size={13} />
              Calipers Active (Δt &amp; BPM)
            </span>
            <span className="badge-purple">
              <Clock size={13} />
              R-R Interval: {Math.round(60000 / activePatient.baselineHeartRate)} ms
            </span>
          </div>
        </div>

        {/* Right Column: Device Overview & Recent Alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Device Overview Card */}
          <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>Device Overview</h3>
              <span className="badge-blue" style={{ fontSize: '0.7rem' }}>{activePatient.patientId}</span>
            </div>

            <div className="device-specs-list">
              <div className="spec-row">
                <span className="spec-label">Model</span>
                <span className="spec-value" style={{ fontWeight: 800 }}>{activePatient.deviceModel}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Device Serial</span>
                <span className="spec-value" style={{ fontFamily: 'var(--font-mono)' }}>{activePatient.serialNumber}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Pacing Mode</span>
                <span className="spec-value" style={{ color: '#2563eb', fontWeight: 800 }}>VVI ({activePatient.lowerRateLimit} BPM)</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Lead Impedance</span>
                <span className="spec-value">{activePatient.leadImpedanceOhms} Ω</span>
              </div>
            </div>

            {/* Battery Trend Progress Bar */}
            <div className="battery-progress-container" style={{ marginTop: '16px' }}>
              <div className="battery-progress-labels">
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Battery Reserve</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669' }}>{activePatient.batteryPercentage}% (~{activePatient.batteryLongevityYears} yrs)</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${activePatient.batteryPercentage}%`, background: '#10b981' }} />
              </div>
            </div>
          </div>

          {/* Recent Alerts Card */}
          <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>Recent Clinical Alerts</h3>
              <button 
                onClick={() => onNavigateTab('reports')} 
                style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
              >
                View Ledger →
              </button>
            </div>

            <div className="alerts-list">
              {alerts.slice(0, 3).map(alt => (
                <div key={alt.alertId} className={`alert-item-card ${alt.severity.toLowerCase()}`}>
                  <div className="alert-icon">
                    {alt.severity === 'WARNING' && <AlertTriangle size={15} color="#d97706" />}
                    {alt.severity === 'CRITICAL_ALARM' && <AlertTriangle size={15} color="#ef4444" />}
                    {alt.severity === 'ADVISORY' && <Info size={15} color="#2563eb" />}
                  </div>
                  <div className="alert-text-content">
                    <h4>{alt.title}</h4>
                    <p>{alt.description.substring(0, 80)}...</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 6. Explore the Platform Grid (8 Soft-Rounded 22px Cards with Circular Icons) */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '16px', color: '#0f172a' }}>
          Explore Platform Operations
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 400, marginLeft: '8px' }}>
            Direct access to all 11 specialized clinical, research, and cybersecurity workspaces.
          </span>
        </h3>

        <div className="explore-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
          
          <div className="explore-card" onClick={() => onNavigateTab('live-monitoring')} style={{ borderRadius: '18px', padding: '16px' }}>
            <div className="explore-card-top">
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={18} color="#2563eb" />
              </div>
              <ArrowRight size={14} color="#94a3b8" />
            </div>
            <h4 style={{ fontWeight: 800, marginTop: '8px' }}>Live Monitoring</h4>
            <p>Synchronized 4-track oscilloscope &amp; impulse decision flow.</p>
          </div>

          <div className="explore-card" onClick={() => onNavigateTab('trends')} style={{ borderRadius: '18px', padding: '16px' }}>
            <div className="explore-card-top">
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={18} color="#2563eb" />
              </div>
              <ArrowRight size={14} color="#94a3b8" />
            </div>
            <h4 style={{ fontWeight: 800, marginTop: '8px' }}>Trends &amp; Analytics</h4>
            <p>Longitudinal 1h-30d HRV indicators and pacing statistics.</p>
          </div>

          <div className="explore-card" onClick={() => onNavigateTab('ai-analytics')} style={{ borderRadius: '18px', padding: '16px' }}>
            <div className="explore-card-top">
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cpu size={18} color="#7c3aed" />
              </div>
              <ArrowRight size={14} color="#94a3b8" />
            </div>
            <h4 style={{ fontWeight: 800, marginTop: '8px' }}>AI Cardiac Analytics</h4>
            <p>9 rhythm pattern classes, feature extraction, and evidence.</p>
          </div>

          <div className="explore-card" onClick={() => onNavigateTab('research')} style={{ borderRadius: '18px', padding: '16px' }}>
            <div className="explore-card-top">
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FlaskConical size={18} color="#2563eb" />
              </div>
              <ArrowRight size={14} color="#94a3b8" />
            </div>
            <h4 style={{ fontWeight: 800, marginTop: '8px' }}>Research Workspace</h4>
            <p>HeartGPT transformer lab and 8 canonical scenarios.</p>
          </div>

          <div className="explore-card" onClick={() => onNavigateTab('security')} style={{ borderRadius: '18px', padding: '16px' }}>
            <div className="explore-card-top">
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#ecfeff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={18} color="#0891b2" />
              </div>
              <ArrowRight size={14} color="#94a3b8" />
            </div>
            <h4 style={{ fontWeight: 800, marginTop: '8px' }}>Security Center</h4>
            <p>Mock BLE pairing and interactive 10-threat attack console.</p>
          </div>

          <div className="explore-card" onClick={() => onNavigateTab('battery-model')} style={{ borderRadius: '18px', padding: '16px' }}>
            <div className="explore-card-top">
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Battery size={18} color="#059669" />
              </div>
              <ArrowRight size={14} color="#94a3b8" />
            </div>
            <h4 style={{ fontWeight: 800, marginTop: '8px' }}>Battery Model</h4>
            <p>Duty-cycle power budget, SVG donut, and flood attack.</p>
          </div>

          <div className="explore-card" onClick={() => onNavigateTab('verification')} style={{ borderRadius: '18px', padding: '16px' }}>
            <div className="explore-card-top">
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={18} color="#16a34a" />
              </div>
              <ArrowRight size={14} color="#94a3b8" />
            </div>
            <h4 style={{ fontWeight: 800, marginTop: '8px' }}>Verification Suite</h4>
            <p>25+ automated acceptance tests across 5 suites.</p>
          </div>

          <div className="explore-card" onClick={() => onNavigateTab('settings')} style={{ borderRadius: '18px', padding: '16px' }}>
            <div className="explore-card-top">
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cpu size={18} color="#2563eb" />
              </div>
              <ArrowRight size={14} color="#94a3b8" />
            </div>
            <h4 style={{ fontWeight: 800, marginTop: '8px' }}>Settings &amp; Gate</h4>
            <p>4-tier role auth, reprogramming gate, and DB sync.</p>
          </div>

        </div>
      </div>

    </div>
  );
};
