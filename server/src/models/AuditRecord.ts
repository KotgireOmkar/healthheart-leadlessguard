import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditRecord extends Document {
  blockIndex: number;
  timestamp: Date;
  actorRole: string;
  category: string;
  action: string;
  patientId?: string;
  details: string;
  previousBlockHash: string;
  currentBlockHash: string;
}

const AuditRecordSchema: Schema = new Schema({
  blockIndex: { type: Number, required: true, unique: true },
  timestamp: { type: Date, default: Date.now },
  actorRole: { type: String, required: true },
  category: { type: String, required: true },
  action: { type: String, required: true },
  patientId: { type: String },
  details: { type: String, required: true },
  previousBlockHash: { type: String, required: true },
  currentBlockHash: { type: String, required: true },
});

export const AuditRecord = mongoose.model<IAuditRecord>('AuditRecord', AuditRecordSchema);
