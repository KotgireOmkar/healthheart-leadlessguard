import React, { useRef, useEffect, useState } from 'react';
import { WaveformPoint } from '../services/signalGenerators';
import { Play, Pause, Maximize2, MoveHorizontal } from 'lucide-react';

interface ECGCanvasProps {
  data: WaveformPoint[];
  leadName?: string;
  samplingRate?: number;
  height?: number;
  showCalipers?: boolean;
}

export const ECGCanvas: React.FC<ECGCanvasProps> = ({
  data,
  leadName = 'Lead II',
  height = 240,
  showCalipers = true,
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

    // Center Zero line
    const zeroY = h / 2 + 10;
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, zeroY);
    ctx.lineTo(width, zeroY);
    ctx.stroke();

    if (!data || data.length === 0) return;

    // Draw ECG trace
    ctx.strokeStyle = '#2563eb'; // Clinical royal blue
    ctx.lineWidth = 2.2;
    ctx.lineJoin = 'round';
    ctx.beginPath();

    const pointsToDraw = Math.min(data.length, Math.floor(width * 1.5));
    const scaleY = 48; // mv scaling

    for (let i = 0; i < pointsToDraw; i++) {
      const idx = (i + sweepOffset) % data.length;
      const pt = data[idx];
      const x = (i / pointsToDraw) * width;
      const y = zeroY - pt.ecg * scaleY;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);

      // Pacing spike marker
      if (pt.isPaced) {
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

    // Draw Calipers if enabled
    if (showCalipers) {
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
  }, [data, sweepOffset, caliper1, caliper2, showCalipers]);

  // Caliper interval math
  const deltaPx = Math.abs(caliper2 - caliper1);
  const timeMs = Math.round(deltaPx * 4.1); // ~4.1ms per pixel at 25mm/s
  const bpm = timeMs > 0 ? Math.round(60000 / timeMs) : 0;

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
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>25 mm/s • 10 mm/mV • 250 Hz</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {showCalipers && (
            <div style={{ background: '#f1f5f9', padding: '3px 10px', borderRadius: '6px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              <MoveHorizontal size={13} style={{ display: 'inline', marginRight: '4px' }} />
              Δt: {timeMs} ms ({bpm} BPM)
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
