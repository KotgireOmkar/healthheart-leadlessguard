// Web Audio API Multi-Tier Clinical Alert Sound Engine
// 100% Free & Open-Source (Zero External Dependencies, Zero Cost)
// Synthesizes clinical hospital alarms: Mild (<50 BPM), Moderate (<40 BPM), Severe (<30 BPM)

export type AlertTier = 'NORMAL' | 'MILD_BRADY' | 'MODERATE_BRADY' | 'SEVERE_BRADY';

class AlertAudioEngine {
  private audioCtx: AudioContext | null = null;
  private repeatTimerId: number | null = null;
  private isMuted: boolean = false;
  private currentTier: AlertTier = 'NORMAL';

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  /**
   * Play Mild Bradycardia Alert Tone (<50 BPM)
   * Gentle, non-intrusive 2-tone melodic chime: 600 Hz (150ms) -> 750 Hz (200ms)
   */
  public playMildAlert(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Note 1: 600 Hz
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(600, now);
      gain1.gain.setValueAtTime(0.0001, now);
      gain1.gain.linearRampToValueAtTime(0.18, now + 0.015);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.17);

      // Note 2: 750 Hz
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(750, now + 0.16);
      gain2.gain.setValueAtTime(0.0001, now + 0.16);
      gain2.gain.linearRampToValueAtTime(0.20, now + 0.175);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.16);
      osc2.stop(now + 0.40);
    } catch {
      // Audio context restricted before user interaction
    }
  }

  /**
   * Play Moderate Bradycardia Alert Tone (<40 BPM)
   * Urgent double-pulsing warning buzzer: Two 750 Hz beeps with 80ms silence
   */
  public playModerateAlert(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Beep 1 (750 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle'; // Richer medical alert overtone
      osc1.frequency.setValueAtTime(750, now);
      gain1.gain.setValueAtTime(0.0001, now);
      gain1.gain.linearRampToValueAtTime(0.22, now + 0.01);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.12);

      // Beep 2 (750 Hz) after 90ms gap
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(750, now + 0.12);
      gain2.gain.setValueAtTime(0.0001, now + 0.12);
      gain2.gain.linearRampToValueAtTime(0.24, now + 0.13);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.26);
    } catch {
      // Handled gracefully
    }
  }

  /**
   * Play Severe Bradycardia Code Red Siren (<30 BPM)
   * High-priority alternating 900 Hz / 1200 Hz medical alarm
   */
  public playSevereAlert(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const pitches = [900, 1200, 900, 1200];
      pitches.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.12;
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.linearRampToValueAtTime(0.26, start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.10);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.11);
      });
    } catch {
      // Handled gracefully
    }
  }

  /**
   * Check heart rate and trigger appropriate acoustic alarm sequence
   */
  public checkAndTriggerAlert(bpm: number): AlertTier {
    this.stopAlertAudio();

    if (bpm < 30) {
      this.currentTier = 'SEVERE_BRADY';
      this.playSevereAlert();
      // Repeat severe siren every 1.5 seconds
      this.repeatTimerId = window.setInterval(() => {
        this.playSevereAlert();
      }, 1500);
      return 'SEVERE_BRADY';
    } else if (bpm < 40) {
      this.currentTier = 'MODERATE_BRADY';
      this.playModerateAlert();
      // Repeat moderate double beep every 2.5 seconds
      this.repeatTimerId = window.setInterval(() => {
        this.playModerateAlert();
      }, 2500);
      return 'MODERATE_BRADY';
    } else if (bpm < 50) {
      this.currentTier = 'MILD_BRADY';
      this.playMildAlert();
      // Repeat mild chime every 6 seconds
      this.repeatTimerId = window.setInterval(() => {
        this.playMildAlert();
      }, 6000);
      return 'MILD_BRADY';
    } else {
      this.currentTier = 'NORMAL';
      return 'NORMAL';
    }
  }

  /**
   * Stop all repeating alert audio immediately (silence)
   */
  public stopAlertAudio(): void {
    if (this.repeatTimerId !== null) {
      window.clearInterval(this.repeatTimerId);
      this.repeatTimerId = null;
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted) {
      this.stopAlertAudio();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getCurrentTier(): AlertTier {
    return this.currentTier;
  }
}

export const alertAudio = new AlertAudioEngine();
