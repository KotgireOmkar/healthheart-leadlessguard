// Deterministic Mathematical Biosignal Generator
// P-QRS-T morphology synthesis, Arterial PPG with dicrotic notch, SpO2, and Thoracic BIA

export interface WaveformPoint {
  time: number;
  ecg: number;
  ppg: number;
  spo2: number;
  bia: number;
  isPaced: boolean;
}

export class BiosignalSimulator {
  private sampleRate: number = 250; // 250 Hz for ECG
  private phase: number = 0;
  private heartRateBpm: number;
  private pacingBurdenPercent: number;
  private noiseAmplitude: number;

  constructor(heartRateBpm: number = 72, pacingBurdenPercent: number = 0, noiseAmplitude: number = 0.02) {
    this.heartRateBpm = heartRateBpm;
    this.pacingBurdenPercent = pacingBurdenPercent;
    this.noiseAmplitude = noiseAmplitude;
  }

  public setPatientParameters(hr: number, pacingBurden: number, noise: number = 0.02) {
    this.heartRateBpm = hr;
    this.pacingBurdenPercent = pacingBurden;
    this.noiseAmplitude = noise;
  }

  // Generate a buffer of points for time span
  public generateBuffer(durationSeconds: number = 10): WaveformPoint[] {
    const totalSamples = Math.floor(durationSeconds * this.sampleRate);
    const points: WaveformPoint[] = [];
    const beatIntervalSec = 60 / this.heartRateBpm;
    const samplesPerBeat = Math.floor(beatIntervalSec * this.sampleRate);

    for (let i = 0; i < totalSamples; i++) {
      const t = i / this.sampleRate;
      const beatPhase = (i % samplesPerBeat) / samplesPerBeat; // 0 to 1 in cardiac cycle
      const isPacingBeat = Math.random() * 100 < this.pacingBurdenPercent;

      // ECG Synthesis (Gaussian mixture for P, Q, R, S, T)
      let ecg = 0;

      // Pacing spike (if paced beat)
      let isPaced = false;
      if (isPacingBeat && beatPhase >= 0.18 && beatPhase <= 0.19) {
        ecg += 1.8; // Sharp pacing spike
        isPaced = true;
      }

      // P Wave (atrial depolarization)
      const pCenter = 0.12;
      const pWidth = 0.035;
      ecg += 0.18 * Math.exp(-Math.pow(beatPhase - pCenter, 2) / (2 * Math.pow(pWidth, 2)));

      // Q Wave
      const qCenter = 0.20;
      const qWidth = 0.012;
      ecg -= 0.15 * Math.exp(-Math.pow(beatPhase - qCenter, 2) / (2 * Math.pow(qWidth, 2)));

      // R Wave (tall ventricular depolarization)
      const rCenter = 0.22;
      const rWidth = 0.015;
      ecg += (isPacingBeat ? 1.6 : 1.4) * Math.exp(-Math.pow(beatPhase - rCenter, 2) / (2 * Math.pow(rWidth, 2)));

      // S Wave
      const sCenter = 0.245;
      const sWidth = 0.015;
      ecg -= 0.35 * Math.exp(-Math.pow(beatPhase - sCenter, 2) / (2 * Math.pow(sWidth, 2)));

      // T Wave (ventricular repolarization)
      const tCenter = 0.42;
      const tWidth = 0.065;
      ecg += 0.32 * Math.exp(-Math.pow(beatPhase - tCenter, 2) / (2 * Math.pow(tWidth, 2)));

      // Baseline wander (respiration 0.25 Hz)
      ecg += 0.05 * Math.sin(2 * Math.PI * 0.25 * t);
      // High-frequency noise
      ecg += (Math.random() - 0.5) * this.noiseAmplitude;

      // Arterial PPG Synthesis with dicrotic notch
      // Peak arrives ~ 180ms after R wave (Pulse transit time)
      const ppgPhase = (beatPhase + 0.78) % 1.0;
      let ppg = 0;
      if (ppgPhase < 0.6) {
        // Systolic rise and peak
        ppg = Math.sin((ppgPhase / 0.6) * Math.PI);
        // Dicrotic notch reflection at ~ 0.35
        if (ppgPhase > 0.28 && ppgPhase < 0.45) {
          ppg += 0.25 * Math.sin(((ppgPhase - 0.28) / 0.17) * Math.PI);
        }
      } else {
        // Diastolic exponential decay
        ppg = Math.exp(-(ppgPhase - 0.6) * 6) * 0.15;
      }
      ppg += (Math.random() - 0.5) * 0.02;

      // SpO2 saturation trend (baseline 98%)
      const spo2 = 98 + 0.4 * Math.sin(2 * Math.PI * 0.2 * t) + (Math.random() - 0.5) * 0.1;

      // Thoracic BIA impedance (baseline 580 Ohms modulated by tidal volume respiration)
      const bia = 580 + 15 * Math.sin(2 * Math.PI * 0.25 * t) + (Math.random() - 0.5) * 0.5;

      points.push({ time: t, ecg, ppg, spo2, bia, isPaced });
    }

    return points;
  }
}

export const simulator = new BiosignalSimulator();
