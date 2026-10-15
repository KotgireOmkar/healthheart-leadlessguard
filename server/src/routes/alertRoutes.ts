import { Router, Request, Response } from 'express';
import { ClinicalAlert } from '../models/ClinicalAlert.js';

const router = Router();

// GET all alerts
router.get('/', async (req: Request, res: Response) => {
  try {
    const filter = req.query.patientId ? { patientId: req.query.patientId } : {};
    const alerts = await ClinicalAlert.find(filter).sort({ timestamp: -1 });
    res.json(alerts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST acknowledge alert
router.post('/:id/acknowledge', async (req: Request, res: Response) => {
  try {
    const { acknowledgedBy, notes } = req.body;
    const alert = await ClinicalAlert.findOneAndUpdate(
      { alertId: req.params.id },
      {
        status: 'ACKNOWLEDGED',
        acknowledgedBy: acknowledgedBy || 'Dr. Clinician EP',
        acknowledgedAt: new Date(),
        resolutionNotes: notes,
      },
      { new: true }
    );
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    res.json(alert);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST resolve alert
router.post('/:id/resolve', async (req: Request, res: Response) => {
  try {
    const { notes } = req.body;
    const alert = await ClinicalAlert.findOneAndUpdate(
      { alertId: req.params.id },
      {
        status: 'RESOLVED',
        ...(notes && { resolutionNotes: notes }),
      },
      { new: true }
    );
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    res.json(alert);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
