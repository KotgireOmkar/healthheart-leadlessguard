import mongoose, { Schema, Document } from 'mongoose';

export interface IScenarioRecord extends Document {
  scenarioCode: string;
  name: string;
  description: string;
  status: 'PASS' | 'FAIL' | 'BLOCKED' | 'NOT_TESTED';
  executedAt: Date;
  metrics: Record<string, any>;
  assertionsPassed: number;
  totalAssertions: number;
}

const ScenarioRecordSchema: Schema = new Schema({
  scenarioCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true, default: 'NOT_TESTED' },
  executedAt: { type: Date, default: Date.now },
  metrics: { type: Schema.Types.Mixed, default: {} },
  assertionsPassed: { type: Number, default: 0 },
  totalAssertions: { type: Number, default: 0 },
});

export const ScenarioRecord = mongoose.model<IScenarioRecord>('ScenarioRecord', ScenarioRecordSchema);
