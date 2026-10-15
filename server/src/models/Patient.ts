import mongoose, { Schema, Document } from 'mongoose';

export interface IPatient extends Document {
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
  updatedAt: Date;
}

const PatientSchema: Schema = new Schema({
  patientId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  implantDate: { type: String, required: true },
  deviceModel: { type: String, required: true, default: 'LeadlessGuard-VR Pro' },
  serialNumber: { type: String, required: true },
  rhythmProfile: { type: String, required: true },
  baselineHeartRate: { type: Number, required: true },
  pacingBurdenPercent: { type: Number, required: true, default: 0 },
  lowerRateLimit: { type: Number, required: true, default: 60 },
  refractoryPeriodMs: { type: Number, required: true, default: 250 },
  captureThresholdVolts: { type: Number, required: true, default: 0.5 },
  leadImpedanceOhms: { type: Number, required: true, default: 580 },
  batteryLongevityYears: { type: Number, required: true, default: 8.4 },
  batteryPercentage: { type: Number, required: true, default: 92 },
  rWaveAmplitudeMv: { type: Number, required: true, default: 10.4 },
  signalQualityIndex: { type: Number, required: true, default: 98 },
  telemetryStatus: { type: String, required: true, default: 'ONLINE' },
  activeScenario: { type: String, required: true, default: 'SCENARIO_D' },
  updatedAt: { type: Date, default: Date.now },
});

export const Patient = mongoose.model<IPatient>('Patient', PatientSchema);
