import { Router, Request, Response } from 'express';
import { TelemetryPacket } from '../models/TelemetryPacket.js';

const router = Router();

// POST new telemetry packet
router.post('/', async (req: Request, res: Response) => {
  try {
    const packet = new TelemetryPacket(req.body);
    await packet.save();
    res.status(201).json(packet);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET latest packets for patient
router.get('/:patientId', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const packets = await TelemetryPacket.find({ patientId: req.params.patientId })
      .sort({ sequenceNumber: -1 })
      .limit(limit);
    res.json(packets);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
