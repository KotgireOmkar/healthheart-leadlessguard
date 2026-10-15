import mongoose, { Schema, Document } from 'mongoose';

export interface IClinicalAlert extends Document {
  alertId: string;
  patientId: string;
  patientName: string;
  timestamp: Date;
  severity: 'CRITICAL_ALARM' | 'WARNING' | 'ADVISORY';
  ruleIdentifier: string;
  title: string;
  description: string;
  sourceSignal: string;
  vitalValues: Record<string, any>;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolutionNotes?: string;
  auditBlockIndex?: number;
}

const ClinicalAlertSchema: Schema = new Schema({
  alertId: { type: String, required: true, unique: true },
  patientId: { type: String, required: true, index: true },
  patientName: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  severity: { type: String, required: true },
  ruleIdentifier: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  sourceSignal: { type: String, required: true },
  vitalValues: { type: Schema.Types.Mixed, default: {} },
  status: { type: String, required: true, default: 'ACTIVE' },
  acknowledgedBy: { type: String },
  acknowledgedAt: { type: Date },
  resolutionNotes: { type: String },
  auditBlockIndex: { type: Number },
});

export const ClinicalAlert = mongoose.model<IClinicalAlert>('ClinicalAlert', ClinicalAlertSchema);
