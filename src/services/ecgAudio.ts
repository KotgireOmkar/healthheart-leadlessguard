// Web Audio API Real-Time Clinical ECG Heart Monitor Sound Engine
// 100% Free & Open-Source (Zero External Dependencies, Zero Cost)
// Generates authentic hospital patient monitor acoustic signatures

class ECGAudioEngine {
  private audioCtx: AudioContext | null = null;
  private timerId: number | null = null;
  private isMuted: boolean = false;
  private currentBpm: number = 72;
  private currentPacingBurden: number = 0;
  private isAfib: boolean = false;
  private isRunning: boolean = false;

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
   * Play a single clinical heart monitor beep.
   * @param isPaced If true, emits a 1046.5 Hz (C6) paced chime; otherwise 880 Hz (A5) intrinsic beep.
   */
  public playBeep(isPaced: boolean = false): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Clinical Monitor Frequencies
      // 880 Hz (A5) for normal sinus / intrinsic QRS complex
      // 1046.5 Hz (C6) for ventricular paced escape/capture pulses
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isPaced ? 1046.5 : 880.0, now);

      // Acoustic envelope: 5ms attack, 65ms exponential decay to avoid speaker click
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.16, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.070);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.075);
    } catch {
      // Audio context might be restricted before initial gesture
    }
  }

  /**
   * Schedule continuous rhythmic beeps at the specified heart rate.
   */
  private scheduleNextBeat(): void {
    if (!this.isRunning) return;

    // Determine if this beat is paced based on burden percentage
    const isPaced = Math.random() * 100 < this.currentPacingBurden;
    this.playBeep(isPaced);

    // Calculate interval in ms from BPM: Delta t = (60 / BPM) * 1000
    let intervalMs = Math.max(300, Math.round((60 / this.currentBpm) * 1000));

    // Slight physiological irregularity if Atrial Fibrillation
    if (this.isAfib) {
      const jitter = (Math.random() - 0.5) * 60; // +/- 30ms
      intervalMs = Math.max(350, Math.round(intervalMs + jitter));
    }

    this.timerId = window.setTimeout(() => {
      this.scheduleNextBeat();
    }, intervalMs);
  }

  /**
   * Start ECG audio rhythm.
   * @param bpm Patient heart rate in beats per minute
   * @param pacingBurden Percentage of paced beats (0 to 100)
   * @param isAfib Whether patient has irregular AFib rhythm
   */
  public startRhythm(bpm: number, pacingBurden: number = 0, isAfib: boolean = false): void {
    this.currentBpm = Math.max(30, Math.min(220, bpm));
    this.currentPacingBurden = pacingBurden;
    this.isAfib = isAfib;

    // Ensure AudioContext is awakened
    this.getContext();

    // If already running with same settings, no need to reset
    if (this.isRunning && this.timerId !== null) {
      return;
    }

    this.stopRhythm();
    this.isRunning = true;
    this.scheduleNextBeat();
  }

  /**
   * Stop ECG audio rhythm immediately (complete silence).
   */
  public stopRhythm(): void {
    this.isRunning = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  /**
   * Update tempo dynamically (e.g. after slicer execution or patient switch).
   */
  public updateTempo(bpm: number, pacingBurden: number = 0, isAfib: boolean = false): void {
    this.currentBpm = Math.max(30, Math.min(220, bpm));
    this.currentPacingBurden = pacingBurden;
    this.isAfib = isAfib;

    if (this.isRunning) {
      // Re-trigger timer with the new tempo
      if (this.timerId !== null) {
        window.clearTimeout(this.timerId);
        this.timerId = null;
      }
      this.scheduleNextBeat();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

export const ecgAudio = new ECGAudioEngine();
