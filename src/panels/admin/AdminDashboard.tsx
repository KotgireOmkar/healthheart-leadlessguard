import React, { useState, useEffect } from 'react';
import { Patient, ClinicalAlert } from '../../types';
import { ECGCanvas, SignalModality } from '../../components/ECGCanvas';
import { simulator } from '../../services/signalGenerators';
import { api } from '../../services/api';
import { 
  Heart, 
  Activity, 
  Battery, 
  Cpu, 
  CheckCircle2, 
  TrendingUp, 
  FlaskConical, 
  ArrowRight,
  ShieldCheck,
  Clock,
  Play,
  Pause,
  Sliders,
  Zap,
  Waves,
  Droplets,
  Wind,
  RotateCcw,
  Sparkles,
  Lock,
  Volume2,
  VolumeX,
  AlertTriangle,
  ShieldAlert,
  PhoneCall,
  Ambulance
} from 'lucide-react';
import { AdminTab } from '../../components/Sidebar';
import { ecgAudio } from '../../services/ecgAudio';
import { alertAudio } from '../../services/alertAudio';
import { AlertModal } from '../../components/AlertModal';

interface AdminDashboardProps {
  patients: Patient[];
  activePatient: Patient;
  onSelectPatient: (patient: Patient) => void;
  alerts: ClinicalAlert[];
  onNavigateTab: (tab: AdminTab) => void;
  onPatientUpdated?: (patient: Patient) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  patients,
  activePatient,
  onSelectPatient,
  alerts,
  onNavigateTab,
  onPatientUpdated,
}) => {
  const [activeSignalTab, setActiveSignalTab] = useState<SignalModality>('ECG');
  const [isPlayingStrip, setIsPlayingStrip] = useState<boolean>(true);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  // Tab switching: ECG activates real audio, other tabs turn audio off immediately
  const handleSignalTabChange = (tab: SignalModality) => {
    setActiveSignalTab(tab);
    if (tab === 'ECG') {
      if (isPlayingStrip && !isAudioMuted) {
        ecgAudio.startRhythm(
          activePatient.baselineHeartRate,
          activePatient.pacingBurdenPercent,
          activePatient.patientId === 'PT-005'
        );
      }
    } else {
      ecgAudio.stopRhythm();
    }
  };

  // Toggle freeze/unfreeze
  const togglePlayStrip = () => {
    const nextState = !isPlayingStrip;
    setIsPlayingStrip(nextState);
    if (!nextState) {
      ecgAudio.stopRhythm();
    } else if (activeSignalTab === 'ECG' && !isAudioMuted) {
      ecgAudio.startRhythm(
        activePatient.baselineHeartRate,
        activePatient.pacingBurdenPercent,
        activePatient.patientId === 'PT-005'
      );
    }
  };

  // Toggle audio mute
  const toggleAudioMute = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    ecgAudio.setMuted(nextMuted);
    if (nextMuted) {
      ecgAudio.stopRhythm();
    } else if (activeSignalTab === 'ECG' && isPlayingStrip) {
      ecgAudio.startRhythm(
        activePatient.baselineHeartRate,
        activePatient.pacingBurdenPercent,
        activePatient.patientId === 'PT-005'
      );
    }
  };

  // Sync ECG audio rhythm whenever active patient changes
  useEffect(() => {
    if (activeSignalTab === 'ECG' && isPlayingStrip && !isAudioMuted) {
      ecgAudio.updateTempo(
        activePatient.baselineHeartRate,
        activePatient.pacingBurdenPercent,
        activePatient.patientId === 'PT-005'
      );
    }
  }, [activePatient.patientId, activePatient.baselineHeartRate, activePatient.pacingBurdenPercent, activeSignalTab, isPlayingStrip, isAudioMuted]);

  // Clean up audio context timer when component unmounts
  useEffect(() => {
    return () => {
      ecgAudio.stopRhythm();
      alertAudio.stopAlertAudio();
    };
  }, []);

  // Alert Modal State
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);

  // Automatically trigger alarm audio & status checks when active patient HR changes
  useEffect(() => {
    alertAudio.checkAndTriggerAlert(activePatient.baselineHeartRate);
  }, [activePatient.baselineHeartRate, activePatient.patientId]);

  // Handle Simulation of HR drops from Alert Modal
  const handleSimulateHeartRate = (newHr: number) => {
    const updated = { ...activePatient, baselineHeartRate: newHr };
    if (onPatientUpdated) {
      onPatientUpdated(updated);
    }
    simulator.setPatientParameters(newHr, activePatient.pacingBurdenPercent, activePatient.patientId === 'PT-005' ? 0.08 : 0.02);
    if (activeSignalTab === 'ECG' && isPlayingStrip && !isAudioMuted) {
      ecgAudio.updateTempo(newHr, activePatient.pacingBurdenPercent, activePatient.patientId === 'PT-005');
    }
    alertAudio.checkAndTriggerAlert(newHr);
  };

  // Handle Reprogramming LRL to cure early
  const handleReprogramLrl = async (newLrl: number) => {
    setSlicerLrl(newLrl);
    try {
      const updated = await api.updatePatientParameters(activePatient.patientId, {
        lowerRateLimit: newLrl,
        baselineHeartRate: newLrl
      });
      if (onPatientUpdated) {
        onPatientUpdated(updated);
      }
      simulator.setPatientParameters(newLrl, updated.pacingBurdenPercent, updated.patientId === 'PT-005' ? 0.08 : 0.02);
      if (activeSignalTab === 'ECG' && isPlayingStrip && !isAudioMuted) {
        ecgAudio.updateTempo(newLrl, updated.pacingBurdenPercent, updated.patientId === 'PT-005');
      }
      alertAudio.checkAndTriggerAlert(newLrl);
      setExecutionMessage(`✓ Telemetry Verified: Lower Rate Limit raised to ${newLrl} BPM. Patient stabilized and alert cleared!`);
      setTimeout(() => setExecutionMessage(null), 5000);
    } catch {
      handleSimulateHeartRate(newLrl);
    }
  };

  // Clinician Slicers State
  const [slicerLrl, setSlicerLrl] = useState<number>(activePatient.lowerRateLimit);
  const [slicerVoltage, setSlicerVoltage] = useState<number>(activePatient.captureThresholdVolts);
  const [slicerRefractory, setSlicerRefractory] = useState<number>(activePatient.refractoryPeriodMs);
  const [slicerSensitivity, setSlicerSensitivity] = useState<number>(activePatient.rWaveAmplitudeMv);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionMessage, setExecutionMessage] = useState<string | null>(null);

  // Sync slicer defaults when active patient changes
  useEffect(() => {
    setSlicerLrl(activePatient.lowerRateLimit);
    setSlicerVoltage(activePatient.captureThresholdVolts);
    setSlicerRefractory(activePatient.refractoryPeriodMs);
    setSlicerSensitivity(activePatient.rWaveAmplitudeMv);
    setExecutionMessage(null);
  }, [activePatient.patientId, activePatient.lowerRateLimit, activePatient.captureThresholdVolts, activePatient.refractoryPeriodMs, activePatient.rWaveAmplitudeMv]);

  // Update simulator parameters for active patient
  simulator.setPatientParameters(
    activePatient.baselineHeartRate,
    activePatient.pacingBurdenPercent,
    activePatient.patientId === 'PT-005' ? 0.08 : 0.02
  );
  const waveformData = simulator.generateBuffer(10);

  // Handle Execute Telemetry Reprogramming via Slicers
  const handleExecuteReprogramming = async () => {
    setIsExecuting(true);
    setExecutionMessage(null);
    try {
      // If LRL increased above current baseline HR, sync baseline HR so heart speeds up
      const updatedBaselineHr = slicerLrl > activePatient.baselineHeartRate ? slicerLrl : activePatient.baselineHeartRate;
      const updated = await api.updatePatientParameters(activePatient.patientId, {
        lowerRateLimit: slicerLrl,
        captureThresholdVolts: slicerVoltage,
        refractoryPeriodMs: slicerRefractory,
        rWaveAmplitudeMv: slicerSensitivity,
        baselineHeartRate: updatedBaselineHr,
      });

      if (onPatientUpdated) {
        onPatientUpdated(updated);
      }

      // Re-tune biosignal simulator in real time
      simulator.setPatientParameters(
        updated.baselineHeartRate,
        updated.pacingBurdenPercent,
        updated.patientId === 'PT-005' ? 0.08 : 0.02
      );

      // Re-sync ECG audio tempo in real time if ECG tab is active
      if (activeSignalTab === 'ECG' && isPlayingStrip && !isAudioMuted) {
        ecgAudio.updateTempo(
          updated.baselineHeartRate,
          updated.pacingBurdenPercent,
          updated.patientId === 'PT-005'
        );
      }

      setExecutionMessage(`✓ Telemetry Link Verified: Pacemaker successfully reprogrammed to ${slicerLrl} BPM LRL & ${slicerVoltage.toFixed(2)}V output for ${activePatient.patientId}.`);
      setTimeout(() => setExecutionMessage(null), 5000);
    } catch {
      setExecutionMessage(`Error transmitting telemetry to pacemaker.`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleResetSlicers = () => {
    setSlicerLrl(activePatient.lowerRateLimit);
    setSlicerVoltage(activePatient.captureThresholdVolts);
    setSlicerRefractory(activePatient.refractoryPeriodMs);
    setSlicerSensitivity(activePatient.rWaveAmplitudeMv);
    setExecutionMessage('Slicers reset to current pacemaker device values.');
    setTimeout(() => setExecutionMessage(null), 3000);
  };

  // Helper for persona initials
  const getPersonaAlias = (fullName: string, patientId: string) => {
    const parts = fullName.split(' ');
    if (parts.length > 1) {
      return parts[parts.length - 1].replace(/[^a-zA-Z0-9]/g, '');
    }
    const clean = patientId.replace(/[^a-zA-Z0-9]/g, '');
    return clean.slice(-3);
  };

  const getPatientSpo2 = (patient: Patient): number => {
    if (patient.spo2) return patient.spo2;
    switch (patient.patientId) {
      case 'PT-001': return 98;
      case 'PT-002': return 97;
      case 'PT-003': return 96;
      case 'PT-004': return 97;
      case 'PT-005': return 95;
      default: return 97;
    }
  };

  // Dynamic Subtitle for Oscilloscope
  const getSignalSubtitle = () => {
    switch (activeSignalTab) {
      case 'PPG':
        return '● 100 Hz Optical Pulse Plethysmogram (Arterial Inflow)';
      case 'SpO2':
        return '● 50 Hz Calibrated Photodiode Perfusion Stream';
      case 'BIA':
        return '● 20 Hz Sub-Clavicular Vector (Fluid & Tidal Dynamics)';
      case 'ECG':
      default:
        return '● 250 Hz Continuous Intracardiac Stream (Lead II)';
    }
  };

  const getSignalLeadName = () => {
    switch (activeSignalTab) {
      case 'PPG':
        return 'Arterial Photoplethysmogram (PPG)';
      case 'SpO2':
        return 'Pulse Oximetry Plethysmogram (SpO₂)';
      case 'BIA':
        return 'Transthoracic Bioimpedance (BIA)';
      case 'ECG':
      default:
        return 'Lead II (Intracardiac EGM)';
    }
  };

  return (
    <div className="content-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. Patient Switcher Tabs Bar with Live Alert Dots */}
      <div className="patient-tabs-bar">
        {patients.map(p => {
          const isSevere = p.baselineHeartRate < 30;
          const isModerate = p.baselineHeartRate < 40;
          const isMild = p.baselineHeartRate < 50;
          const alertColor = isSevere ? '#dc2626' : isModerate ? '#ea580c' : isMild ? '#d97706' : '#10b981';
          return (
            <button
              key={p.patientId}
              className={`patient-tab-btn ${activePatient.patientId === p.patientId ? 'active' : ''}`}
              onClick={() => onSelectPatient(p)}
              style={{ position: 'relative' }}
            >
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: alertColor, boxShadow: isModerate ? `0 0 8px ${alertColor}` : 'none' }} />
              <div>
                <span className="tab-name" style={{ fontWeight: 800 }}>{p.fullName}</span>
                {isModerate && (
                  <span style={{ marginLeft: 6, fontSize: '0.62rem', background: '#ffedd5', color: '#c2410c', padding: '1px 5px', borderRadius: '4px', fontWeight: 800 }}>
                    &lt;40 BPM
                  </span>
                )}
                {isMild && !isModerate && (
                  <span style={{ marginLeft: 6, fontSize: '0.62rem', background: '#fef3c7', color: '#b45309', padding: '1px 5px', borderRadius: '4px', fontWeight: 800 }}>
                    &lt;50 BPM
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. Persona Header Card */}
      <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '20px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#dbeafe', border: '2px solid #93c5fd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e40af', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '0.5px' }}>
            <span>{getPersonaAlias(activePatient.fullName, activePatient.patientId)}</span>
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

        {/* Status Capsules Row & ALERT Button on each patient interface */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Interactive ALERT Button */}
          <button
            onClick={() => setIsAlertModalOpen(true)}
            style={{
              background: activePatient.baselineHeartRate < 30 ? '#fee2e2' : activePatient.baselineHeartRate < 40 ? '#ffedd5' : activePatient.baselineHeartRate < 50 ? '#fef3c7' : '#ecfdf5',
              border: `1.5px solid ${activePatient.baselineHeartRate < 30 ? '#ef4444' : activePatient.baselineHeartRate < 40 ? '#f97316' : activePatient.baselineHeartRate < 50 ? '#f59e0b' : '#10b981'}`,
              borderRadius: '9999px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 800,
              color: activePatient.baselineHeartRate < 30 ? '#b91c1c' : activePatient.baselineHeartRate < 40 ? '#c2410c' : activePatient.baselineHeartRate < 50 ? '#b45309' : '#15803d',
              cursor: 'pointer',
              boxShadow: activePatient.baselineHeartRate < 40 ? '0 0 12px rgba(234, 88, 12, 0.4)' : 'none'
            }}
            title="Open Clinical Bradycardia Alert Center"
          >
            <AlertTriangle size={15} />
            <span>
              {activePatient.baselineHeartRate < 30
                ? `ALERT: Severe (${activePatient.baselineHeartRate} BPM)`
                : activePatient.baselineHeartRate < 40
                ? `ALERT: Moderate (<40 BPM)`
                : activePatient.baselineHeartRate < 50
                ? `ALERT: Mild (<50 BPM)`
                : `ALERT: Normal (${activePatient.baselineHeartRate} BPM)`}
            </span>
          </button>

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

      {/* Persistent Urgent Clinician Message Banner when < 40 BPM */}
      {activePatient.baselineHeartRate < 40 && (
        <div style={{
          background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
          border: '2px solid #f97316',
          borderRadius: '18px',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 4px 14px rgba(249, 115, 22, 0.22)',
          animation: 'pulseGlow 2s infinite'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', flexShrink: 0 }}>
              <ShieldAlert size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                CRITICAL CLINICAL ACTION REQUIRED: PATIENT {activePatient.fullName} ({activePatient.baselineHeartRate} BPM)
              </div>
              <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#7c2d12', marginTop: '2px', lineHeight: 1.4 }}>
                &ldquo;Call patient to hospital immediately or dispatch emergency care toward them as it is below 40 beats. Do not look for further less than 30 beats, cure them early!&rdquo;
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setIsAlertModalOpen(true)}
              style={{
                background: '#ea580c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '9px 18px',
                fontSize: '0.82rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(234, 88, 12, 0.3)'
              }}
            >
              <PhoneCall size={14} /> Open Alert Dispatch
            </button>
          </div>
        </div>
      )}

      {/* Mild Notification Banner when < 50 BPM */}
      {activePatient.baselineHeartRate < 50 && activePatient.baselineHeartRate >= 40 && (
        <div style={{
          background: '#fffbeb',
          border: '1.5px solid #f59e0b',
          borderRadius: '16px',
          padding: '12px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={18} color="#d97706" />
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#b45309' }}>Mild Bradycardia Warning (&lt;50 BPM): </span>
              <span style={{ fontSize: '0.82rem', color: '#92400e' }}>Patient {activePatient.fullName} telemetry heart rate is {activePatient.baselineHeartRate} BPM. Patient notified to rest and keep phone nearby.</span>
            </div>
          </div>
          <button
            onClick={() => setIsAlertModalOpen(true)}
            style={{
              background: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '8px',
              padding: '5px 14px',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#b45309',
              cursor: 'pointer'
            }}
          >
            Review Alert
          </button>
        </div>
      )}

      {/* Execution Feedback Notification */}
      {executionMessage && (
        <div style={{ 
          padding: '12px 18px', 
          background: executionMessage.startsWith('✓') ? '#ecfdf5' : '#eff6ff', 
          border: `1.5px solid ${executionMessage.startsWith('✓') ? '#a7f3d0' : '#bfdbfe'}`, 
          borderRadius: '16px', 
          color: executionMessage.startsWith('✓') ? '#065f46' : '#1e40af', 
          fontWeight: 700, 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)' 
        }}>
          <CheckCircle2 size={18} color={executionMessage.startsWith('✓') ? '#059669' : '#2563eb'} />
          <span>{executionMessage}</span>
        </div>
      )}

      {/* 3. Vitals Metric Grid (4 Cards with Glowing Containers) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        
        {/* Card 1: Heart Rate */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Heart Rate</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
              {activePatient.baselineHeartRate} <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>BPM</span>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#059669' }}>
              ● Rhythm Steady &amp; Protected
            </span>
          </div>
          <div className="radial-heart-glow">
            <Heart size={34} color="#ef4444" fill="#ef4444" className="beating-heart-icon" />
          </div>
        </div>

        {/* Card 2: Pacing Demand Burden */}
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

        {/* Card 3: Battery Longevity */}
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

        {/* Card 4: Device Status */}
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

      {/* 4. Tri-Colour Clinical Diagnostic Rings */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        {/* Ring 1: Intrinsic R-Wave Amplitude */}
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

        {/* Ring 2: Bipolar Lead Impedance */}
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
                strokeDashoffset={(2 * Math.PI * 32) * (1 - Math.min(1, activePatient.leadImpedanceOhms / 1500))}
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

        {/* Ring 3: Signal Quality Index SQI */}
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

      {/* 5. Main 2-Column Split: Oscilloscope & Telemetry Slicers / Device Overview */}
      <div className="dashboard-main-split">
        
        {/* Left Column: Live Biosignals Oscilloscope Card */}
        <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={togglePlayStrip}
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
                  {getSignalSubtitle()}
                </span>
              </div>
            </div>

            {/* Signal Modality Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {(['ECG', 'PPG', 'SpO2', 'BIA'] as const).map(tab => (
                <button
                  key={tab}
                  className={`signal-color-pill ${tab.toLowerCase()}-pill ${activeSignalTab === tab ? 'active' : ''}`}
                  onClick={() => handleSignalTabChange(tab)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  {tab}
                  {tab === 'ECG' && activeSignalTab === 'ECG' && !isAudioMuted && (
                    <Volume2 size={12} style={{ color: '#ffffff' }} />
                  )}
                </button>
              ))}

              {activeSignalTab === 'ECG' && (
                <button
                  onClick={toggleAudioMute}
                  style={{
                    background: isAudioMuted ? '#fef2f2' : '#f0fdf4',
                    border: `1px solid ${isAudioMuted ? '#fecaca' : '#bbf7d0'}`,
                    borderRadius: '8px',
                    padding: '4px 8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: isAudioMuted ? '#dc2626' : '#16a34a',
                    cursor: 'pointer',
                    marginLeft: '4px'
                  }}
                  title={isAudioMuted ? 'Unmute Clinical ECG Audio' : 'Mute Clinical ECG Audio'}
                >
                  {isAudioMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                  <span>{isAudioMuted ? 'Muted' : 'Audio On'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Canvas Waveform */}
          <ECGCanvas
            data={waveformData}
            leadName={getSignalLeadName()}
            height={220}
            showCalipers={true}
            signalType={activeSignalTab}
            spo2Value={getPatientSpo2(activePatient)}
            pulseRateValue={activePatient.baselineHeartRate}
          />

          {/* Dynamic Modality Parameter Info Strip (Changes with each tab) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', background: '#f8fafc', padding: '12px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            {activeSignalTab === 'ECG' && (
              <>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>R-R Interval</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1e40af', fontFamily: 'var(--font-mono)' }}>{Math.round(60000 / activePatient.baselineHeartRate)} ms</div>
                  <div style={{ fontSize: '0.62rem', color: '#059669' }}>Target: 600-1000ms</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>R-Wave Amplitude</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1e40af', fontFamily: 'var(--font-mono)' }}>{activePatient.rWaveAmplitudeMv} mV</div>
                  <div style={{ fontSize: '0.62rem', color: '#059669' }}>Target: &gt; 1.0 mV</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>QRS Duration</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1e40af', fontFamily: 'var(--font-mono)' }}>92 ms</div>
                  <div style={{ fontSize: '0.62rem', color: '#059669' }}>Narrow Intrinsic</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Pacing Demand</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1e40af', fontFamily: 'var(--font-mono)' }}>{activePatient.pacingBurdenPercent}%</div>
                  <div style={{ fontSize: '0.62rem', color: activePatient.pacingBurdenPercent > 50 ? '#d97706' : '#059669' }}>VVI Demand Mode</div>
                </div>
              </>
            )}

            {activeSignalTab === 'PPG' && (
              <>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Pulse Transit (PTT)</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#be123c', fontFamily: 'var(--font-mono)' }}>182 ms</div>
                  <div style={{ fontSize: '0.62rem', color: '#059669' }}>Norm: 150-250ms</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Perfusion Amplitude</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#be123c', fontFamily: 'var(--font-mono)' }}>1.15 AU</div>
                  <div style={{ fontSize: '0.62rem', color: '#059669' }}>Pulsatile Inflow Normal</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Dicrotic Notch</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#be123c' }}>Intact</div>
                  <div style={{ fontSize: '0.62rem', color: '#059669' }}>Normal Elasticity (35%)</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Stiffness Index (SI)</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#be123c', fontFamily: 'var(--font-mono)' }}>6.4 m/s</div>
                  <div style={{ fontSize: '0.62rem', color: '#059669' }}>Compliance Verified</div>
                </div>
              </>
            )}

            {activeSignalTab === 'SpO2' && (
              <>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Blood Oxygenation</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#047857', fontFamily: 'var(--font-mono)' }}>98.4% SpO₂</div>
                  <div style={{ fontSize: '0.62rem', color: '#059669' }}>Optimal Gas Exchange</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Perfusion Index (PI)</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#047857', fontFamily: 'var(--font-mono)' }}>4.8%</div>
                  <div style={{ fontSize: '0.62rem', color: '#059669' }}>Norm: &gt; 1.5%</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Red / IR Ratio (R)</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#047857', fontFamily: 'var(--font-mono)' }}>0.82</div>
                  <div style={{ fontSize: '0.62rem', color: '#059669' }}>Photodiode Calibrated</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Desaturation Index</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#047857', fontFamily: 'var(--font-mono)' }}>0.0 / hr</div>
                  <div style={{ fontSize: '0.62rem', color: '#059669' }}>Zero Hypoxic Episodes</div>
                </div>
              </>
            )}

            {activeSignalTab === 'BIA' && (
              <>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Transthoracic Base Z₀</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#b45309', fontFamily: 'var(--font-mono)' }}>{activePatient.leadImpedanceOhms} Ω</div>
                  <div style={{ fontSize: '0.62rem', color: '#059669' }}>Nominal: 400-1000 Ω</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Derived Respiration</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#b45309', fontFamily: 'var(--font-mono)' }}>15 BrPM</div>
                  <div style={{ fontSize: '0.62rem', color: '#059669' }}>Tidal Sinusoidal Coupling</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Tidal Delta (ΔZ)</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#b45309', fontFamily: 'var(--font-mono)' }}>15.2 Ω</div>
                  <div style={{ fontSize: '0.62rem', color: '#059669' }}>Excursion Amplitude</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Fluid Balance Index</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#b45309' }}>Dry / Stable</div>
                  <div style={{ fontSize: '0.62rem', color: '#059669' }}>No Pulmonary Edema</div>
                </div>
              </>
            )}
          </div>

          {/* Bottom Time Interval Range Markers */}
          <div className="rhythm-time-markers" style={{ padding: '0 10px' }}>
            <span>0:00 - 0:10 (Epoch Alpha)</span>
            <span>0:10 - 0:20 (Epoch Beta)</span>
            <span>0:20 - 0:30 (Continuous Live Sync)</span>
          </div>

          {/* Dynamic Bottom Waveform Badges */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '6px' }}>
            {activeSignalTab === 'ECG' && (
              <>
                <span className="badge-blue">
                  <Activity size={13} />
                  ECG: 25 mm/s | 10 mm/mV (Lead II)
                </span>
                <span className="badge-emerald">
                  <CheckCircle2 size={13} />
                  Calipers: Δt &amp; BPM Active
                </span>
                <span className="badge-purple">
                  <Clock size={13} />
                  R-R Interval: {Math.round(60000 / activePatient.baselineHeartRate)} ms
                </span>
              </>
            )}

            {activeSignalTab === 'PPG' && (
              <>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '8px', background: '#ffe4e6', color: '#be123c', fontSize: '0.74rem', fontWeight: 700 }}>
                  <Waves size={13} />
                  Arterial PPG: Optical Plethysmogram
                </span>
                <span className="badge-emerald">
                  <CheckCircle2 size={13} />
                  Dicrotic Notch: Intact &amp; Sharp
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '8px', background: '#eff6ff', color: '#1d4ed8', fontSize: '0.74rem', fontWeight: 700 }}>
                  <Clock size={13} />
                  PTT: 182 ms
                </span>
              </>
            )}

            {activeSignalTab === 'SpO2' && (
              <>
                <span className="badge-emerald">
                  <Droplets size={13} />
                  Blood Oxygenation: 98.4% SpO₂
                </span>
                <span className="badge-blue">
                  <CheckCircle2 size={13} />
                  Perfusion Index: 4.8% (Optimal)
                </span>
                <span className="badge-purple">
                  <Activity size={13} />
                  Pleth Variability: 11%
                </span>
              </>
            )}

            {activeSignalTab === 'BIA' && (
              <>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '8px', background: '#fef3c7', color: '#b45309', fontSize: '0.74rem', fontWeight: 700 }}>
                  <Wind size={13} />
                  BIA Baseline: {activePatient.leadImpedanceOhms} Ω
                </span>
                <span className="badge-emerald">
                  <CheckCircle2 size={13} />
                  Derived Respiration: 15 BrPM
                </span>
                <span className="badge-blue">
                  <Activity size={13} />
                  Fluid Status: Stable / Dry
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Parameter Slicers & Device Overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Slicers Card: Live Clinician Pacemaker Calibration Console */}
          <div style={{ background: '#ffffff', border: '1.5px solid #dbeafe', borderRadius: '22px', padding: '22px', boxShadow: '0 4px 12px rgba(37,99,235,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 32, height: 32, borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                  <Sliders size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>Pacemaker Parameter Slicers</h3>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Live OTA Telemetry Calibration</span>
                </div>
              </div>
              <button
                onClick={handleResetSlicers}
                style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: 700 }}
                title="Reset Slicers to Stored Pacemaker Values"
              >
                <RotateCcw size={12} />
                Reset
              </button>
            </div>

            {/* Slicer 1: Lower Rate Limit (LRL) */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                  Lower Rate Limit (LRL)
                </span>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#2563eb', fontFamily: 'var(--font-mono)' }}>
                  {slicerLrl} BPM <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>({(60000 / slicerLrl).toFixed(0)}ms)</span>
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                step="1"
                value={slicerLrl}
                onChange={e => setSlicerLrl(Number(e.target.value))}
                style={{ width: '100%', height: '6px', borderRadius: '3px', accentColor: '#2563eb', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.64rem', color: '#94a3b8', marginTop: '3px' }}>
                <span>40 BPM (Floor)</span>
                <span>Current: {activePatient.lowerRateLimit} BPM</span>
                <span>100 BPM (Ceiling)</span>
              </div>
            </div>

            {/* Slicer 2: Capture Pulse Amplitude (Voltage) */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                  Pacing Pulse Amplitude
                </span>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-mono)' }}>
                  {slicerVoltage.toFixed(2)} V <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>({(slicerVoltage / 0.5).toFixed(1)}x safety)</span>
                </span>
              </div>
              <input
                type="range"
                min="0.20"
                max="5.00"
                step="0.05"
                value={slicerVoltage}
                onChange={e => setSlicerVoltage(Number(e.target.value))}
                style={{ width: '100%', height: '6px', borderRadius: '3px', accentColor: '#059669', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.64rem', color: '#94a3b8', marginTop: '3px' }}>
                <span>0.20 V (Min)</span>
                <span>Current: {activePatient.captureThresholdVolts.toFixed(2)} V</span>
                <span>5.00 V (Max)</span>
              </div>
            </div>

            {/* Slicer 3: Ventricular Refractory Period (VRP) */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                  Refractory Period (VRP)
                </span>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#7c3aed', fontFamily: 'var(--font-mono)' }}>
                  {slicerRefractory} ms
                </span>
              </div>
              <input
                type="range"
                min="150"
                max="450"
                step="10"
                value={slicerRefractory}
                onChange={e => setSlicerRefractory(Number(e.target.value))}
                style={{ width: '100%', height: '6px', borderRadius: '3px', accentColor: '#7c3aed', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.64rem', color: '#94a3b8', marginTop: '3px' }}>
                <span>150 ms</span>
                <span>Current: {activePatient.refractoryPeriodMs} ms</span>
                <span>450 ms</span>
              </div>
            </div>

            {/* Slicer 4: Sensing Sensitivity Threshold */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                  Sensing Sensitivity Margin
                </span>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#d97706', fontFamily: 'var(--font-mono)' }}>
                  {slicerSensitivity.toFixed(1)} mV
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="15.0"
                step="0.1"
                value={slicerSensitivity}
                onChange={e => setSlicerSensitivity(Number(e.target.value))}
                style={{ width: '100%', height: '6px', borderRadius: '3px', accentColor: '#d97706', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.64rem', color: '#94a3b8', marginTop: '3px' }}>
                <span>0.5 mV (High)</span>
                <span>Current: {activePatient.rWaveAmplitudeMv.toFixed(1)} mV</span>
                <span>15.0 mV (Low)</span>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
              <button
                onClick={() => setSlicerLrl(60)}
                style={{ flex: 1, padding: '5px 8px', borderRadius: '8px', border: '1px solid #e2e8f0', background: slicerLrl === 60 ? '#eff6ff' : '#ffffff', color: slicerLrl === 60 ? '#1d4ed8' : '#64748b', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer' }}
              >
                60 BPM (Rest)
              </button>
              <button
                onClick={() => setSlicerLrl(75)}
                style={{ flex: 1, padding: '5px 8px', borderRadius: '8px', border: '1px solid #e2e8f0', background: slicerLrl === 75 ? '#eff6ff' : '#ffffff', color: slicerLrl === 75 ? '#1d4ed8' : '#64748b', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer' }}
              >
                75 BPM (Pace)
              </button>
              <button
                onClick={() => setSlicerVoltage(1.2)}
                style={{ flex: 1, padding: '5px 8px', borderRadius: '8px', border: '1px solid #e2e8f0', background: slicerVoltage === 1.2 ? '#ecfdf5' : '#ffffff', color: slicerVoltage === 1.2 ? '#047857' : '#64748b', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer' }}
              >
                1.2V (Boost)
              </button>
            </div>

            {/* Execute Button */}
            <button
              onClick={handleExecuteReprogramming}
              disabled={isExecuting}
              style={{
                width: '100%',
                background: isExecuting ? '#93c5fd' : '#2563eb',
                border: 'none',
                borderRadius: '14px',
                padding: '12px 18px',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: isExecuting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
                transition: 'all 0.15s ease'
              }}
            >
              <Zap size={16} color="#ffffff" fill="#ffffff" />
              {isExecuting ? 'Transmitting OTA Telemetry...' : 'Execute'}
            </button>
          </div>

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
                <span className="spec-value" style={{ fontWeight: 800 }}>{activePatient.leadImpedanceOhms} Ω</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Battery Reserve</span>
                <span className="spec-value" style={{ color: '#059669', fontWeight: 800 }}>{activePatient.batteryPercentage}% (~{activePatient.batteryLongevityYears} yrs)</span>
              </div>
            </div>
          </div>

          {/* Recent Clinical Alerts Card */}
          <div style={{ background: '#ffffff', border: '1px solid #eaecf0', borderRadius: '22px', padding: '22px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>Recent Clinical Alerts</h3>
              <span 
                onClick={() => onNavigateTab('reports')}
                style={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}
              >
                View Ledger &rarr;
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {alerts.slice(0, 3).map(alt => (
                <div 
                  key={alt.alertId}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: alt.severity === 'WARNING' ? '#fffbeb' : '#eff6ff',
                    borderLeft: `4px solid ${alt.severity === 'WARNING' ? '#f59e0b' : '#3b82f6'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={13} color={alt.severity === 'WARNING' ? '#d97706' : '#2563eb'} />
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>{alt.title}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', lineHeight: 1.3 }}>
                    {alt.description.length > 90 ? alt.description.substring(0, 90) + '...' : alt.description}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 6. Explore Platform Operations Grid */}
      <div style={{ marginTop: '10px' }}>
        <div style={{ marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>Explore Platform Operations</h3>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Direct access to all 11 specialized clinical, research, and cybersecurity workspaces.</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
          
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
            <h4 style={{ fontWeight: 800, marginTop: '8px' }}>Cardiac Analytics</h4>
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

      {/* Clinical Alert & Bradycardia Response Modal */}
      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        patient={activePatient}
        onSimulateHeartRate={handleSimulateHeartRate}
        onReprogramLrl={handleReprogramLrl}
      />

    </div>
  );
};
