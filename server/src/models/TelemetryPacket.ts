import mongoose, { Schema, Document } from 'mongoose';

export interface ITelemetryPacket extends Document {
  packetId: string;
  patientId: string;
  sequenceNumber: number;
  observedAt: Date;
  source: string;
  heartRateBpm: number;
  pacingActive: boolean;
  pacingPercentage: number;
  spo2Percent: number;
  pulseRateBpm: number;
  impedanceOhms: number;
  signalQuality: 'GOOD' | 'ACCEPTABLE' | 'POOR' | 'UNAVAILABLE';
  isValid: boolean;
  rejectionReason?: string;
  createdAt: Date;
}

const TelemetryPacketSchema: Schema = new Schema({
  packetId: { type: String, required: true, unique: true },
  patientId: { type: String, required: true, index: true },
  sequenceNumber: { type: Number, required: true },
  observedAt: { type: Date, required: true },
  source: { type: String, required: true, default: 'SIMULATION' },
  heartRateBpm: { type: Number, required: true },
  pacingActive: { type: Boolean, required: true, default: false },
  pacingPercentage: { type: Number, required: true, default: 0 },
  spo2Percent: { type: Number, required: true, default: 98 },
  pulseRateBpm: { type: Number, required: true },
  impedanceOhms: { type: Number, required: true, default: 580 },
  signalQuality: { type: String, required: true, default: 'GOOD' },
  isValid: { type: Boolean, required: true, default: true },
  rejectionReason: { type: String },
  createdAt: { type: Date, default: Date.now, expires: 86400 * 7 }, // TTL 7 days
});

export const TelemetryPacket = mongoose.model<ITelemetryPacket>('TelemetryPacket', TelemetryPacketSchema);
