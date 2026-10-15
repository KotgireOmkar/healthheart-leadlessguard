// Leadless Pacemaker Firmware Emulation Core
// Deterministic mathematical implementation of VVI/VVIR ventricular demand pacing

export interface DeviceDiagnostics {
  deviceId: string;
  modelName: string;
  firmwareVersion: string;
  telemetryProtocol: string;
  serialNumber: string;
  deviceTemperatureC: number;
  leadImpedanceOhms: number;
  batteryPercentage: number;
  batteryLongevityYears: number;
  captureThresholdVolts: number;
  sensingThresholdMv: number;
  refractoryPeriodMs: number;
  lowerRateLimitBpm: number;
  escapeIntervalMs: number;
  sensedEventsCount: number;
  pacedEventsCount: number;
  pacingBurdenPercent: number;
  captureStatus: 'CAPTURED' | 'LOSS_OF_CAPTURE';
  deviceStatus: 'NORMAL' | 'PACING_ACTIVE' | 'WARNING' | 'STANDBY';
}

export interface CardiacEventRecord {
  eventId: string;
  timestamp: string;
  eventType: 'VS' | 'VP' | 'REFRACTORY' | 'SENSE_LOST' | 'CAPTURE_VERIFIED';
  source: 'INTRINSIC' | 'PACED_STIMULUS';
  instantaneousHr: number;
  escapeTimerMs: number;
  sequenceNumber: number;
  details: string;
}

export type ElectrophysiologyScenario = 
  | 'NORMAL_SINUS'
  | 'COMPLETE_HEART_BLOCK'
  | 'SINUS_BRADYCARDIA'
  | 'IRREGULAR_AFIB'
  | 'VENTRICULAR_TACHYCARDIA'
  | 'INTERMITTENT_CONDUCTION'
  | 'NOISY_SENSOR'
  | 'SENSOR_DROPOUT';

export class PacingEngine {
  private lowerRateLimitBpm: number = 60;
  private refractoryPeriodMs: number = 250;
  private captureThresholdVolts: number = 0.5;
  private sensingThresholdMv: number = 1.5;
  private leadImpedanceOhms: number = 580;
  private deviceTemperatureC: number = 37.1;
  private batteryPercentage: number = 92;
  private batteryLongevityYears: number = 8.4;

  private sensedEventsCount: number = 1420;
  private pacedEventsCount: number = 28;
  private sequenceNumber: number = 8492;
  private activeScenario: ElectrophysiologyScenario = 'NORMAL_SINUS';

  private eventLog: CardiacEventRecord[] = [];

  constructor() {
    this.seedInitialEvents();
  }

  private seedInitialEvents() {
    const now = Date.now();
    for (let i = 10; i >= 1; i--) {
      this.eventLog.push({
        eventId: `EVT-${this.sequenceNumber - i}`,
        timestamp: new Date(now - i * 1000).toLocaleTimeString(),
        eventType: 'VS',
        source: 'INTRINSIC',
        instantaneousHr: 72,
        escapeTimerMs: 833,
        sequenceNumber: this.sequenceNumber - i,
        details: 'Intrinsic ventricular event sensed (VS) above LRL escape threshold'
      });
    }
  }

  public getEscapeIntervalMs(): number {
    return Math.round(60000 / this.lowerRateLimitBpm);
  }

  public setLowerRateLimit(lrl: number) {
    this.lowerRateLimitBpm = Math.max(30, Math.min(120, lrl));
  }

  public setScenario(scenario: ElectrophysiologyScenario) {
    this.activeScenario = scenario;
    if (scenario === 'COMPLETE_HEART_BLOCK') {
      this.pacedEventsCount += 120;
    }
  }

  public getScenario(): ElectrophysiologyScenario {
    return this.activeScenario;
  }

  // Evaluate single cardiac cycle decision
  public evaluateBeat(intrinsicIntervalMs: number): {
    pacingTriggered: boolean;
    eventType: 'VS' | 'VP';
    captureStatus: 'CAPTURED' | 'LOSS_OF_CAPTURE';
    eventRecord: CardiacEventRecord;
  } {
    const escapeIntervalMs = this.getEscapeIntervalMs();
    this.sequenceNumber++;

    let pacingTriggered = false;
    let eventType: 'VS' | 'VP' = 'VS';
    let captureStatus: 'CAPTURED' | 'LOSS_OF_CAPTURE' = 'CAPTURED';

    // VVI Pacing Logic: If intrinsic beat interval exceeds escape interval, fire pacing stimulus
    if (this.activeScenario === 'COMPLETE_HEART_BLOCK' || intrinsicIntervalMs > escapeIntervalMs) {
      pacingTriggered = true;
      eventType = 'VP';
      this.pacedEventsCount++;
      captureStatus = 'CAPTURED'; // virtual capture confirmation
    } else {
      pacingTriggered = false;
      eventType = 'VS';
      this.sensedEventsCount++;
    }

    const totalBeats = this.sensedEventsCount + this.pacedEventsCount;
    const instantaneousHr = Math.round(60000 / (pacingTriggered ? escapeIntervalMs : intrinsicIntervalMs));

    const eventRecord: CardiacEventRecord = {
      eventId: `EVT-${this.sequenceNumber}`,
      timestamp: new Date().toLocaleTimeString(),
      eventType,
      source: pacingTriggered ? 'PACED_STIMULUS' : 'INTRINSIC',
      instantaneousHr,
      escapeTimerMs: pacingTriggered ? escapeIntervalMs : intrinsicIntervalMs,
      sequenceNumber: this.sequenceNumber,
      details: pacingTriggered 
        ? `Escape interval timed out (${escapeIntervalMs}ms). Virtual ventricular pacing pulse delivered (VP).`
        : `Intrinsic ventricular depolarization detected (${intrinsicIntervalMs}ms). Pacing output inhibited (VS).`
    };

    this.eventLog.unshift(eventRecord);
    if (this.eventLog.length > 50) this.eventLog.pop();

    return { pacingTriggered, eventType, captureStatus, eventRecord };
  }

  public getDiagnostics(): DeviceDiagnostics {
    const totalBeats = this.sensedEventsCount + this.pacedEventsCount;
    const pacingBurdenPercent = totalBeats > 0 
      ? Math.round((this.pacedEventsCount / totalBeats) * 100) 
      : 0;

    return {
      deviceId: 'LLP-8842-TX',
      modelName: 'LeadlessGuard VR-Pro',
      firmwareVersion: 'v3.4.1',
      telemetryProtocol: 'TG-BLE-5.3',
      serialNumber: 'SN-9482-TX',
      deviceTemperatureC: this.deviceTemperatureC,
      leadImpedanceOhms: this.leadImpedanceOhms,
      batteryPercentage: this.batteryPercentage,
      batteryLongevityYears: this.batteryLongevityYears,
      captureThresholdVolts: this.captureThresholdVolts,
      sensingThresholdMv: this.sensingThresholdMv,
      refractoryPeriodMs: this.refractoryPeriodMs,
      lowerRateLimitBpm: this.lowerRateLimitBpm,
      escapeIntervalMs: this.getEscapeIntervalMs(),
      sensedEventsCount: this.sensedEventsCount,
      pacedEventsCount: this.pacedEventsCount,
      pacingBurdenPercent,
      captureStatus: 'CAPTURED',
      deviceStatus: pacingBurdenPercent > 50 ? 'PACING_ACTIVE' : 'NORMAL'
    };
  }

  public getEventHistory(): CardiacEventRecord[] {
    return this.eventLog;
  }
}

export const pacingEngine = new PacingEngine();
