import React, { useState, useEffect, useRef } from 'react';
import { Patient } from '../../types';
import { 
  Heart, 
  Battery, 
  PhoneCall, 
  CheckCircle2, 
  Bell,
  Play, 
  Pause, 
  Bluetooth
} from 'lucide-react';

interface PatientCompanionViewProps {
  patient: Patient;
}

export const PatientCompanionView: React.FC<PatientCompanionViewProps> = ({ patient }) => {
  const [isPlayingStrip, setIsPlayingStrip] = useState(true);
  const [lastSynced, setLastSynced] = useState('2 minutes ago');
  const [isSyncing, setIsSyncing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Handle Mock Bluetooth Check-in
  const handleSyncCheckin = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSynced('Just now');
    }, 1200);
  };

  // 60 FPS Canvas-driven live rhythm strip with play/pause
  useEffect(() => {
    let animId: number;
    let t = 0;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas with subtle background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.8)';
      ctx.lineWidth = 1;
      const gridSize = 16;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw continuous medical ECG wave
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();

      const centerY = height / 2;
      const step = 2;
      const speed = isPlayingStrip ? 1.5 : 0;
      t += speed;

      for (let x = 0; x < width; x += step) {
        const globalX = (x + t) % 180; // cardiac cycle length ~180px
        let waveY = centerY;

        // P Wave
        if (globalX >= 20 && globalX <= 45) {
          waveY -= Math.sin(((globalX - 20) / 25) * Math.PI) * 7;
        }
        // Q Wave
        else if (globalX >= 55 && globalX <= 62) {
          waveY += 4;
        }
        // Tall R Wave (ventricular depolarization)
        else if (globalX >= 62 && globalX <= 75) {
          if (globalX <= 68) {
            waveY -= ((globalX - 62) / 6) * 32;
          } else {
            waveY -= 32 - ((globalX - 68) / 7) * 38;
          }
        }
        // S Wave
        else if (globalX >= 75 && globalX <= 82) {
          waveY += 6;
        }
        // T Wave (ventricular repolarization)
        else if (globalX >= 105 && globalX <= 140) {
          waveY -= Math.sin(((globalX - 105) / 35) * Math.PI) * 11;
        }

        if (x === 0) {
          ctx.moveTo(x, waveY);
        } else {
          ctx.lineTo(x, waveY);
        }
      }

      ctx.stroke();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlayingStrip]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '420px', margin: '0 auto', paddingBottom: '30px' }}>
      
      {/* 1. Patient Greeting & Notification Bar (Direct Match to Photo) */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Avatar with initials or photo placeholder */}
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#dbeafe', border: '2px solid #93c5fd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e40af', fontWeight: 800, fontSize: '1rem', overflow: 'hidden' }}>
            <span>{patient.fullName.split(' ').map(n => n[0]).join('')}</span>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Welcome,</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>{patient.fullName}</h2>
          </div>
        </div>

        {/* Notification Bell with Badge */}
        <div style={{ position: 'relative', cursor: 'pointer', padding: '6px' }}>
          <Bell size={20} color="#0f172a" />
          <span style={{ position: 'absolute', top: 5, right: 5, width: 8, height: 8, borderRadius: '50%', background: '#ef4444', border: '2px solid #ffffff' }} />
        </div>
      </div>

      {/* Status Pills Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
        <div className="badge-emerald" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
          <CheckCircle2 size={15} color="#059669" />
          <span>Leadless Pacemaker Active</span>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '9999px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <Battery size={15} color="#059669" />
          <span>{patient.batteryLongevityYears} Years Remaining</span>
        </div>
      </div>

      {/* 2. Heart Rate Card with Radial Glowing Beating Heart (Direct Match to Photo) */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Heart Rate</span>
          <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: '1.1', margin: '4px 0 6px' }}>
            {patient.baselineHeartRate} <span style={{ fontSize: '1.3rem', fontWeight: 600, color: '#0f172a' }}>BPM</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#059669' }}>
              Rhythm Steady & Protected
            </span>
          </div>
        </div>

        {/* Soft Radial Glow Container with Beating Heart Icon */}
        <div className="radial-heart-glow">
          <Heart size={36} color="#ef4444" fill="#ef4444" className="beating-heart-icon" />
        </div>
      </div>

      {/* 3. Blood Oxygen SpO2 Card */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '20px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Blood Oxygen</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', margin: '4px 0 6px' }}>
            SpO2 98%
          </div>
          <span className="badge-emerald">
            Sensor Quality: Excellent
          </span>
        </div>
      </div>

      {/* 4. Live Rhythm Pulse Strip with Interactive Controls */}
      <div className="patient-rhythm-strip">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <button
            onClick={() => setIsPlayingStrip(!isPlayingStrip)}
            style={{ width: 28, height: 28, borderRadius: '50%', background: '#ffffff', border: '1.5px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0f172a', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
            title={isPlayingStrip ? 'Pause Rhythm Strip' : 'Resume Rhythm Strip'}
          >
            {isPlayingStrip ? <Pause size={13} fill="#0f172a" /> : <Play size={13} fill="#0f172a" style={{ marginLeft: 2 }} />}
          </button>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Live Cardiac Rhythm Strip</span>
        </div>

        {/* Continuous ECG Canvas */}
        <div className="rhythm-canvas-container">
          <canvas ref={canvasRef} width={380} height={80} style={{ width: '100%', height: '80px', display: 'block' }} />
        </div>

        {/* Calibrated Time Interval Range Markers */}
        <div className="rhythm-time-markers">
          <span>0:00 - 0:10</span>
          <span>0:00 - 0:10 seconds</span>
          <span>0:20 - 0:30</span>
        </div>
      </div>

      {/* 5. Tri-Colour Activity Rings (Royal Blue, Sunset Amber, Royal Purple) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
        
        {/* Ring 1: Daily Steps (Royal Blue) */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '16px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div className="circular-ring-wrapper" style={{ width: 72, height: 72 }}>
            <svg width="72" height="72" className="circular-ring-svg">
              <circle cx="36" cy="36" r="30" strokeWidth="6" className="circular-ring-bg" />
              <circle
                cx="36"
                cy="36"
                r="30"
                strokeWidth="6"
                stroke="#2563eb"
                strokeDasharray={2 * Math.PI * 30}
                strokeDashoffset={(2 * Math.PI * 30) * (1 - 6543 / 10000)}
                className="circular-ring-progress"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>6,543</div>
            </div>
          </div>
          <div style={{ marginTop: '8px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0f172a' }}>Daily Steps</div>
            <div style={{ fontSize: '0.65rem', color: '#64748b' }}>10,000 steps</div>
          </div>
        </div>

        {/* Ring 2: Active Time (Sunset Amber) */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '16px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div className="circular-ring-wrapper" style={{ width: 72, height: 72 }}>
            <svg width="72" height="72" className="circular-ring-svg">
              <circle cx="36" cy="36" r="30" strokeWidth="6" className="circular-ring-bg" />
              <circle
                cx="36"
                cy="36"
                r="30"
                strokeWidth="6"
                stroke="#f59e0b"
                strokeDasharray={2 * Math.PI * 30}
                strokeDashoffset={(2 * Math.PI * 30) * (1 - 45 / 60)}
                className="circular-ring-progress"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>45</div>
            </div>
          </div>
          <div style={{ marginTop: '8px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0f172a' }}>Active Time</div>
            <div style={{ fontSize: '0.65rem', color: '#64748b' }}>60 mins</div>
          </div>
        </div>

        {/* Ring 3: Restful Sleep (Royal Purple) */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '16px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div className="circular-ring-wrapper" style={{ width: 72, height: 72 }}>
            <svg width="72" height="72" className="circular-ring-svg">
              <circle cx="36" cy="36" r="30" strokeWidth="6" className="circular-ring-bg" />
              <circle
                cx="36"
                cy="36"
                r="30"
                strokeWidth="6"
                stroke="#8b5cf6"
                strokeDasharray={2 * Math.PI * 30}
                strokeDashoffset={(2 * Math.PI * 30) * 0}
                className="circular-ring-progress"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>7h 12m</div>
            </div>
          </div>
          <div style={{ marginTop: '8px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0f172a' }}>Restful Sleep</div>
            <div style={{ fontSize: '0.65rem', color: '#64748b' }}>7h 12m</div>
          </div>
        </div>
      </div>

      {/* 6. Mock Bluetooth Check-in Card */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Mock Bluetooth Check-in</span>
          <span className="badge-emerald" style={{ padding: '2px 8px' }}>
            ● All Systems Normal
          </span>
        </div>
        <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '12px' }}>
          Last synchronized: {lastSynced}. Next automated telemetry transmission scheduled tonight.
        </p>
        <button
          onClick={handleSyncCheckin}
          disabled={isSyncing}
          style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#1e3a8a', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s ease' }}
        >
          <Bluetooth size={16} />
          {isSyncing ? 'Connecting to Pacemaker Gateway...' : 'Check Device Connection'}
        </button>
      </div>

      {/* 7. Clinic & Emergency Dual Quick Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <button
          onClick={() => alert('Dialing Hospital Electrophysiology Clinic Hotline...')}
          style={{ padding: '14px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}
        >
          <PhoneCall size={16} color="#2563eb" />
          <span>Contact Cardiology Clinic</span>
        </button>

        <button
          onClick={() => alert('Initiating Hospital Emergency Services protocol (112 / 911)...')}
          style={{ padding: '14px', background: '#ef4444', border: 'none', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}
        >
          <span style={{ background: '#b91c1c', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 900 }}>SOS</span>
          <span>Emergency Call 112/911</span>
        </button>
      </div>

    </div>
  );
};
