import { Router, Request, Response } from 'express';
import { ScenarioRecord } from '../models/ScenarioRecord.js';

const router = Router();

// GET all scenario records
router.get('/', async (_req: Request, res: Response) => {
  try {
    const scenarios = await ScenarioRecord.find().sort({ scenarioCode: 1 });
    res.json(scenarios);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST run/update scenario
router.post('/run/:code', async (req: Request, res: Response) => {
  try {
    const { metrics } = req.body;
    const scenario = await ScenarioRecord.findOneAndUpdate(
      { scenarioCode: String(req.params.code).toUpperCase() },
      {
        status: 'PASS',
        executedAt: new Date(),
        metrics: metrics || {},
      },
      { new: true }
    );
    if (!scenario) return res.status(404).json({ error: 'Scenario not found' });
    res.json(scenario);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
