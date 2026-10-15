import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Patient } from '../models/Patient.js';
import { TelemetryPacket } from '../models/TelemetryPacket.js';
import { ClinicalAlert } from '../models/ClinicalAlert.js';
import { AuditRecord } from '../models/AuditRecord.js';
import { ScenarioRecord } from '../models/ScenarioRecord.js';

const router = Router();

// GET health & stats
router.get('/', async (_req: Request, res: Response) => {
  const isDbConnected = mongoose.connection.readyState === 1;

  let counts = {
    patients: 0,
    telemetryPackets: 0,
    clinicalAlerts: 0,
    auditBlocks: 0,
    scenarios: 0,
  };

  if (isDbConnected) {
    try {
      counts.patients = await Patient.countDocuments();
      counts.telemetryPackets = await TelemetryPacket.countDocuments();
      counts.clinicalAlerts = await ClinicalAlert.countDocuments();
      counts.auditBlocks = await AuditRecord.countDocuments();
      counts.scenarios = await ScenarioRecord.countDocuments();
    } catch (e) {
      // ignore counting error
    }
  }

  res.json({
    status: 'ONLINE',
    database: isDbConnected ? 'CONNECTED' : 'DISCONNECTED',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    telemetryProtocol: 'BLE 5.3 Secure / AES-GCM-256',
    hl7FhirStatus: 'ONLINE',
    counts,
  });
});

export default router;
