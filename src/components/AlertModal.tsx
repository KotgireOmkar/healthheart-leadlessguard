import React, { useState } from 'react';
import { Patient } from '../types';
import { alertAudio, AlertTier } from '../services/alertAudio';
import { 
  AlertTriangle, 
  PhoneCall, 
  Ambulance, 
  Zap, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  X,
  ShieldAlert,
  HeartPulse,
  Clock
} from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onSimulateHeartRate: (newHr: number) => void;
  onReprogramLrl: (newLrl: number) => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  patient,
  onSimulateHeartRate,
  onReprogramLrl,
}) => {
  const [dispatchMessage, setDispatchMessage] = useState<string | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(alertAudio.getIsMuted());

  if (!isOpen) return null;

  const hr = patient.baselineHeartRate;
  let tier: AlertTier = 'NORMAL';
  if (hr < 30) tier = 'SEVERE_BRADY';
  else if (hr < 40) tier = 'MODERATE_BRADY';
  else if (hr < 50) tier = 'MILD_BRADY';

  const handleMuteToggle = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    alertAudio.setMuted(nextMuted);
  };

  const handleCallPatient = () => {
    setDispatchMessage(`✓ Emergency Call Initiated to ${patient.fullName}: "Please come to the hospital cardiac unit immediately or prepare for incoming medical transport."`);
    setTimeout(() => setDispatchMessage(null), 6000);
  };

  const handleDispatchAmbulance = () => {
    setDispatchMessage(`🚑 Rapid Mobile Cardiac Response Unit Dispatched to ${patient.fullName}'s GPS location. ETA: 8 minutes. Telemetry link routed to paramedics.`);
    setTimeout(() => setDispatchMessage(null), 6000);
  };

  const handleCureEarly = () => {
    onReprogramLrl(65);
    setDispatchMessage(`⚡ Pacemaker Lower Rate Limit reprogrammed to 65 BPM! Early stabilization active.`);
    setTimeout(() => setDispatchMessage(null), 5000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.72)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        maxWidth: '680px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: tier === 'MODERATE_BRADY' ? '2px solid #f97316' : tier === 'SEVERE_BRADY' ? '2px solid #ef4444' : tier === 'MILD_BRADY' ? '2px solid #f59e0b' : '1px solid #e2e8f0',
        overflow: 'hidden',
        animation: 'scaleUp 0.2s ease-out'
      }}>
        {/* Header Bar */}
        <div style={{
          padding: '18px 24px',
          background: tier === 'MODERATE_BRADY' ? '#fff7ed' : tier === 'SEVERE_BRADY' ? '#fef2f2' : tier === 'MILD_BRADY' ? '#fffbeb' : '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: tier === 'MODERATE_BRADY' ? '#ea580c' : tier === 'SEVERE_BRADY' ? '#dc2626' : tier === 'MILD_BRADY' ? '#d97706' : '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                Clinical Bradycardia Response Center
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Active Patient: <strong>{patient.fullName}</strong> ({patient.patientId})
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleMuteToggle}
              style={{
                background: isAudioMuted ? '#fef2f2' : '#f0fdf4',
                border: `1px solid ${isAudioMuted ? '#fecaca' : '#bbf7d0'}`,
                borderRadius: '8px',
                padding: '6px 10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: isAudioMuted ? '#dc2626' : '#16a34a',
                cursor: 'pointer'
              }}
              title={isAudioMuted ? 'Unmute Alarm Audio' : 'Mute Alarm Audio'}
            >
              {isAudioMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              <span>{isAudioMuted ? 'Muted' : 'Alarm Sound Live'}</span>
            </button>
            <button
              onClick={onClose}
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '8px',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Current Status Banner */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '16px 20px'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 700 }}>
                Telemetry Heart Rate
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 900, color: tier === 'MODERATE_BRADY' ? '#ea580c' : tier === 'SEVERE_BRADY' ? '#dc2626' : tier === 'MILD_BRADY' ? '#d97706' : '#16a34a', fontFamily: 'var(--font-mono)' }}>
                  {hr}
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#64748b' }}>BPM</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 700 }}>
                Alert Severity Level
              </div>
              <div style={{ marginTop: '4px' }}>
                {tier === 'NORMAL' && (
                  <span style={{ background: '#dcfce7', color: '#15803d', padding: '6px 14px', borderRadius: '100px', fontWeight: 800, fontSize: '0.85rem' }}>
                    ● Normal Safe Cadence (≥50 BPM)
                  </span>
                )}
                {tier === 'MILD_BRADY' && (
                  <span style={{ background: '#fef3c7', color: '#b45309', padding: '6px 14px', borderRadius: '100px', fontWeight: 800, fontSize: '0.85rem' }}>
                    ⚠️ Mild Bradycardia Alert (&lt;50 BPM)
                  </span>
                )}
                {tier === 'MODERATE_BRADY' && (
                  <span style={{ background: '#ffedd5', color: '#c2410c', padding: '6px 14px', borderRadius: '100px', fontWeight: 800, fontSize: '0.85rem', boxShadow: '0 0 10px rgba(234, 88, 12, 0.4)' }}>
                    🚨 Moderate Urgent Alert (&lt;40 BPM)
                  </span>
                )}
                {tier === 'SEVERE_BRADY' && (
                  <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '6px 14px', borderRadius: '100px', fontWeight: 800, fontSize: '0.85rem', boxShadow: '0 0 12px rgba(220, 38, 38, 0.5)' }}>
                    🛑 Severe Code Red (&lt;30 BPM)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Clinician Action Message Box for Moderate Alert (<40 BPM) */}
          {tier === 'MODERATE_BRADY' && (
            <div style={{
              background: '#fff7ed',
              border: '2px solid #f97316',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c2410c', fontWeight: 800, fontSize: '0.88rem' }}>
                <ShieldAlert size={18} />
                <span>MANDATORY CLINICAL INTERVENTION PROTOCOL (&lt;40 BPM)</span>
              </div>
              <div style={{ fontSize: '0.92rem', color: '#7c2d12', lineHeight: 1.5, fontWeight: 600 }}>
                &ldquo;Call patient to hospital immediately or dispatch emergency care toward them as it is below 40 beats. Do not look for further less than 30 beats, cure them early!&rdquo;
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                <button
                  onClick={handleCallPatient}
                  style={{
                    background: '#ea580c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '8px 14px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <PhoneCall size={14} /> Call Patient to Hospital
                </button>
                <button
                  onClick={handleDispatchAmbulance}
                  style={{
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '8px 14px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Ambulance size={14} /> Dispatch Mobile Unit
                </button>
                <button
                  onClick={handleCureEarly}
                  style={{
                    background: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '8px 14px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Zap size={14} /> Reprogram LRL &ge; 65 BPM (Cure Early)
                </button>
              </div>
            </div>
          )}

          {/* Mild Alert Message Box (<50 BPM) */}
          {tier === 'MILD_BRADY' && (
            <div style={{
              background: '#fffbeb',
              border: '1.5px solid #f59e0b',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b45309', fontWeight: 800, fontSize: '0.88rem' }}>
                <AlertTriangle size={16} />
                <span>Mild Alert Protocol Active (&lt;50 BPM)</span>
              </div>
              <div style={{ fontSize: '0.88rem', color: '#92400e', lineHeight: 1.5 }}>
                Notification has been dispatched to <strong>{patient.fullName}</strong> advising them to sit down, rest, and keep their smartphone close. Pacemaker telemetry is closely watching capture margins.
              </div>
            </div>
          )}

          {/* Severe Alert Message Box (<30 BPM) */}
          {tier === 'SEVERE_BRADY' && (
            <div style={{
              background: '#fef2f2',
              border: '2px solid #ef4444',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b91c1c', fontWeight: 800, fontSize: '0.88rem' }}>
                <ShieldAlert size={18} />
                <span>CRITICAL CODE RED PROTOCOL (&lt;30 BPM)</span>
              </div>
              <div style={{ fontSize: '0.92rem', color: '#991b1b', lineHeight: 1.5, fontWeight: 700 }}>
                Extreme life-threatening bradycardia / asystole risk. Immediate emergency hospital transfer and transcutaneous pacing overdrive required!
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleDispatchAmbulance}
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '8px 14px',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Ambulance size={14} /> Emergency EMS Dispatch
                </button>
                <button
                  onClick={handleCureEarly}
                  style={{
                    background: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '8px 14px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Zap size={14} /> Immediate Pacing Override
                </button>
              </div>
            </div>
          )}

          {/* Dispatch Feedback Toast */}
          {dispatchMessage && (
            <div style={{
              background: '#0f172a',
              color: '#ffffff',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              animation: 'fadeIn 0.2s'
            }}>
              <CheckCircle2 size={16} color="#4ade80" />
              <span>{dispatchMessage}</span>
            </div>
          )}

          {/* Interactive Showcase & Simulation Triggers */}
          <div style={{
            borderTop: '1px solid #e2e8f0',
            paddingTop: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Interactive Bradycardia Alert Testing Simulator
              </div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Showcase Software Alerts</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              <button
                onClick={() => onSimulateHeartRate(46)}
                style={{
                  background: hr < 50 && hr >= 40 ? '#fef3c7' : '#ffffff',
                  border: `1.5px solid ${hr < 50 && hr >= 40 ? '#f59e0b' : '#cbd5e1'}`,
                  borderRadius: '10px',
                  padding: '10px 8px',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#b45309' }}>TEST MILD</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>46 BPM</div>
                <div style={{ fontSize: '0.62rem', color: '#64748b' }}>&lt; 50 BPM Alert</div>
              </button>

              <button
                onClick={() => onSimulateHeartRate(36)}
                style={{
                  background: hr < 40 && hr >= 30 ? '#ffedd5' : '#ffffff',
                  border: `1.5px solid ${hr < 40 && hr >= 30 ? '#f97316' : '#cbd5e1'}`,
                  borderRadius: '10px',
                  padding: '10px 8px',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#c2410c' }}>TEST MODERATE</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>36 BPM</div>
                <div style={{ fontSize: '0.62rem', color: '#64748b' }}>&lt; 40 BPM Dispatch</div>
              </button>

              <button
                onClick={() => onSimulateHeartRate(26)}
                style={{
                  background: hr < 30 ? '#fee2e2' : '#ffffff',
                  border: `1.5px solid ${hr < 30 ? '#ef4444' : '#cbd5e1'}`,
                  borderRadius: '10px',
                  padding: '10px 8px',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#b91c1c' }}>TEST SEVERE</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>26 BPM</div>
                <div style={{ fontSize: '0.62rem', color: '#64748b' }}>&lt; 30 BPM Code Red</div>
              </button>

              <button
                onClick={() => onSimulateHeartRate(72)}
                style={{
                  background: hr >= 50 ? '#f0fdf4' : '#ffffff',
                  border: `1.5px solid ${hr >= 50 ? '#22c55e' : '#cbd5e1'}`,
                  borderRadius: '10px',
                  padding: '10px 8px',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#16a34a' }}>RESTORE</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>72 BPM</div>
                <div style={{ fontSize: '0.62rem', color: '#64748b' }}>Normal Baseline</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
            LeadlessGuard Clinical Safety Envelope • Real-Time Automated Dispatch
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 16px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Close Dialog
          </button>
        </div>
      </div>
    </div>
  );
};
