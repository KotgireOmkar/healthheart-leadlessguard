export interface Patient {
  _id?: string;
  patientId: string;
  fullName: string;
  age: number;
  gender: string;
  implantDate: string;
  deviceModel: string;
  serialNumber: string;
  rhythmProfile: string;
  baselineHeartRate: number;
  pacingBurdenPercent: number;
  lowerRateLimit: number;
  refractoryPeriodMs: number;
  captureThresholdVolts: number;
  leadImpedanceOhms: number;
  batteryLongevityYears: number;
  batteryPercentage: number;
  rWaveAmplitudeMv: number;
  signalQualityIndex: number;
  telemetryStatus: 'ONLINE' | 'STANDBY' | 'WARNING';
  activeScenario: string;
  spo2?: number;
}

export interface TelemetryPacket {
  packetId: string;
  patientId: string;
  sequenceNumber: number;
  observedAt: string;
  source: string;
  heartRateBpm: number;
  pacingActive: boolean;
  pacingPercentage: number;
  spo2Percent: number;
  pulseRateBpm: number;
  impedanceOhms: number;
  signalQuality: 'GOOD' | 'ACCEPTABLE' | 'POOR' | 'UNAVAILABLE';
}

export interface ClinicalAlert {
  alertId: string;
  patientId: string;
  patientName: string;
  timestamp: string;
  severity: 'CRITICAL_ALARM' | 'WARNING' | 'ADVISORY';
  ruleIdentifier: string;
  title: string;
  description: string;
  sourceSignal: string;
  vitalValues: Record<string, any>;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolutionNotes?: string;
}

export interface AuditRecord {
  blockIndex: number;
  timestamp: string;
  actorRole: string;
  category: string;
  action: string;
  patientId?: string;
  details: string;
  previousBlockHash: string;
  currentBlockHash: string;
}

export interface ScenarioRecord {
  scenarioCode: string;
  name: string;
  description: string;
  status: 'PASS' | 'FAIL' | 'BLOCKED' | 'NOT_TESTED';
  executedAt: string;
  metrics: Record<string, any>;
  assertionsPassed: number;
  totalAssertions: number;
}
