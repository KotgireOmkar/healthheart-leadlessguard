import React, { useRef, useEffect, useState } from 'react';
import { WaveformPoint } from '../services/signalGenerators';
import { Play, Pause, MoveHorizontal } from 'lucide-react';

export type SignalModality = 'ECG' | 'PPG' | 'SpO2' | 'BIA';

interface ECGCanvasProps {
  data: WaveformPoint[];
  leadName?: string;
  samplingRate?: number;
  height?: number;
  showCalipers?: boolean;
  signalType?: SignalModality;
  spo2Value?: number;
  pulseRateValue?: number;
}

export const ECGCanvas: React.FC<ECGCanvasProps> = ({
  data,
  leadName = 'Lead II',
  height = 240,
  showCalipers = true,
  signalType = 'ECG',
  spo2Value = 97,
  pulseRateValue = 60,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [sweepOffset, setSweepOffset] = useState(0);
  const [caliper1, setCaliper1] = useState(120);
  const [caliper2, setCaliper2] = useState(320);
  const [draggingCaliper, setDraggingCaliper] = useState<1 | 2 | null>(null);

  // Animation frame loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSweepOffset(prev => (prev + 2) % (data.length || 1));
    }, 30);
    return () => clearInterval(interval);
  }, [isPlaying, data.length]);

  // Render Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const h = canvas.height;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, h);

    if (signalType === 'SpO2') {
      // Photo-matched horizontal dashed reference grid lines
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([8, 6]);
      const numLines = 6;
      for (let i = 1; i <= numLines; i++) {
        const y = (h / (numLines + 1)) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    } else {
      // Millimeter Grid (0.04s minor, 0.2s major)
      const gridSize = 16;
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Major grid lines
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.2;
      for (let x = 0; x < width; x += gridSize * 5) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize * 5) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // Center Baseline / Zero line
    const zeroY = signalType === 'PPG' ? h - 45 : signalType === 'SpO2' ? h * 0.86 : h / 2 + 10;
    if (signalType !== 'SpO2') {
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, zeroY);
      ctx.lineTo(width, zeroY);
      ctx.stroke();
    }

    if (!data || data.length === 0) return;

    // Signal-specific styling
    let strokeColor = '#2563eb'; // ECG Royal Blue
    if (signalType === 'PPG') strokeColor = '#e11d48'; // Ruby Pulse Red
    else if (signalType === 'SpO2') strokeColor = '#0077c8'; // Clinical Medical Blue (photo-matched)
    else if (signalType === 'BIA') strokeColor = '#d97706'; // Sunset Amber

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = signalType === 'SpO2' ? 2.8 : 2.4;
    ctx.lineJoin = 'round';
    ctx.beginPath();

    // In SpO2 mode, reserve right side for the digital monitor readout
    const chartWidth = signalType === 'SpO2' ? width - 110 : width;
    const pointsToDraw = Math.min(data.length, Math.floor(chartWidth * 1.5));

    for (let i = 0; i < pointsToDraw; i++) {
      const idx = (i + sweepOffset) % data.length;
      const pt = data[idx];
      const x = (i / pointsToDraw) * chartWidth;
      let y = zeroY;

      if (signalType === 'ECG') {
        const scaleY = 48; // mV scaling
        y = zeroY - pt.ecg * scaleY;
      } else if (signalType === 'PPG') {
        // Scaled arterial photoplethysmogram with systolic peak & dicrotic notch
        y = zeroY - pt.ppg * (h * 0.62);
      } else if (signalType === 'SpO2') {
        // Clinical SpO2 Photoplethysmogram pleth wave (0 to 1 normalized)
        y = zeroY - pt.spo2 * (h * 0.68);
      } else if (signalType === 'BIA') {
        // Transthoracic bioimpedance respiratory wave around 580 Ohms baseline
        const biaDelta = pt.bia - 580;
        y = zeroY - biaDelta * 2.6;
      }

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);

      // Pacing spike marker (only for ECG)
      if (signalType === 'ECG' && pt.isPaced) {
        ctx.save();
        ctx.strokeStyle = '#9333ea';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x, zeroY - 70);
        ctx.lineTo(x, zeroY + 30);
        ctx.stroke();
        ctx.restore();
      }
    }
    ctx.stroke();

    // Right-Side Clinical Digital Monitor Readout (Exact photo match)
    if (signalType === 'SpO2') {
      const panelX = width - 105;

      // Vertical separator
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(panelX, 12);
      ctx.lineTo(panelX, h - 12);
      ctx.stroke();

      // SpO2 Label and Value
      ctx.fillStyle = '#0077c8';
      ctx.font = '700 13px system-ui, -apple-system, sans-serif';
      ctx.fillText('SpO2', panelX + 16, 36);

      ctx.font = '600 10px system-ui, -apple-system, sans-serif';
      ctx.fillText('(%)', panelX + 16, 49);

      const spo2Text = String(spo2Value);
      ctx.font = '800 38px system-ui, -apple-system, sans-serif';
      ctx.fillText(spo2Text, panelX + 14, 90);

      // PR Label and Value
      ctx.font = '700 13px system-ui, -apple-system, sans-serif';
      ctx.fillText('PR', panelX + 16, 134);

      ctx.font = '600 10px system-ui, -apple-system, sans-serif';
      ctx.fillText('(bpm)', panelX + 16, 147);

      const prText = String(pulseRateValue);
      ctx.font = '800 34px system-ui, -apple-system, sans-serif';
      ctx.fillText(prText, panelX + 14, 186);
    }

    // Draw Calipers if enabled (hide in SpO2 to give uncluttered monitor view)
    if (showCalipers && signalType !== 'SpO2') {
      // Caliper 1
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(caliper1, 0);
      ctx.lineTo(caliper1, h);
      ctx.stroke();

      // Caliper 2
      ctx.strokeStyle = '#10b981';
      ctx.beginPath();
      ctx.moveTo(caliper2, 0);
      ctx.lineTo(caliper2, h);
      ctx.stroke();
      ctx.setLineDash([]);

      // Top delta bar
      const minX = Math.min(caliper1, caliper2);
      const maxX = Math.max(caliper1, caliper2);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(minX, 22);
      ctx.lineTo(maxX, 22);
      ctx.stroke();

      // Small tick marks
      ctx.beginPath();
      ctx.moveTo(minX, 17);
      ctx.lineTo(minX, 27);
      ctx.moveTo(maxX, 17);
      ctx.lineTo(maxX, 27);
      ctx.stroke();
    }
  }, [data, sweepOffset, caliper1, caliper2, showCalipers, signalType, spo2Value, pulseRateValue]);

  // Caliper interval math
  const deltaPx = Math.abs(caliper2 - caliper1);
  const timeMs = Math.round(deltaPx * 4.1); // ~4.1ms per pixel at 25mm/s
  const bpm = timeMs > 0 ? Math.round(60000 / timeMs) : 0;

  // Signal specs text
  const getSpecsText = () => {
    switch (signalType) {
      case 'PPG':
        return 'PTT ~182 ms • Modulated Perfusion • 100 Hz';
      case 'SpO2':
        return 'Red/IR AC/DC Ratio: 0.82 • 50 Hz';
      case 'BIA':
        return 'Vector Z₀: 580 Ω • 0.25 Hz Respiration • 20 Hz';
      case 'ECG':
      default:
        return '25 mm/s • 10 mm/mV • 250 Hz';
    }
  };

  const getCaliperReadout = () => {
    switch (signalType) {
      case 'PPG':
        return `PTT: ${timeMs} ms (${bpm} BPM Pulse)`;
      case 'SpO2':
        return `Δt: ${timeMs} ms (98.4% SpO₂)`;
      case 'BIA':
        return `Tidal Period: ${timeMs} ms (15 BrPM)`;
      case 'ECG':
      default:
        return `Δt: ${timeMs} ms (${bpm} BPM)`;
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (Math.abs(x - caliper1) < 15) setDraggingCaliper(1);
    else if (Math.abs(x - caliper2) < 15) setDraggingCaliper(2);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggingCaliper) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(10, Math.min(rect.width - 10, e.clientX - rect.left));
    if (draggingCaliper === 1) setCaliper1(x);
    else setCaliper2(x);
  };

  const handleMouseUp = () => setDraggingCaliper(null);

  return (
    <div className="canvas-wrapper">
      <div style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{leadName}</span>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{getSpecsText()}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {showCalipers && (
            <div style={{ background: '#f1f5f9', padding: '3px 10px', borderRadius: '6px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              <MoveHorizontal size={13} style={{ display: 'inline', marginRight: '4px' }} />
              {getCaliperReadout()}
            </div>
          )}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title={isPlaying ? 'Pause' : 'Resume'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={720}
        height={height}
        style={{ width: '100%', height: `${height}px`, display: 'block', cursor: draggingCaliper ? 'ew-resize' : 'default' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
};
