import { Router, Request, Response } from 'express';
import { Patient } from '../models/Patient.js';

const router = Router();

// GET all patients
router.get('/', async (_req: Request, res: Response) => {
  try {
    const patients = await Patient.find().sort({ patientId: 1 });
    res.json(patients);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET single patient by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findOne({ patientId: req.params.id });
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update patient parameters (reprogramming approval)
router.patch('/:id/parameters', async (req: Request, res: Response) => {
  try {
    const { lowerRateLimit, pacingMode, refractoryPeriodMs } = req.body;
    const patient = await Patient.findOneAndUpdate(
      { patientId: req.params.id },
      { 
        ...(lowerRateLimit !== undefined && { lowerRateLimit }),
        ...(pacingMode !== undefined && { pacingMode }),
        ...(refractoryPeriodMs !== undefined && { refractoryPeriodMs }),
        updatedAt: new Date(),
      },
      { new: true }
    );
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
