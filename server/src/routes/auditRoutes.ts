import { Router, Request, Response } from 'express';
import { AuditRecord } from '../models/AuditRecord.js';
import crypto from 'crypto';

const router = Router();

// GET full audit trail
router.get('/', async (_req: Request, res: Response) => {
  try {
    const records = await AuditRecord.find().sort({ blockIndex: 1 });
    res.json(records);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST append new audit record
router.post('/', async (req: Request, res: Response) => {
  try {
    const { actorRole, category, action, patientId, details } = req.body;
    
    // Get last block
    const lastBlock = await AuditRecord.findOne().sort({ blockIndex: -1 });
    const previousBlockHash = lastBlock ? lastBlock.currentBlockHash : '0000000000000000000000000000000000000000000000000000000000000000';
    const nextIndex = lastBlock ? lastBlock.blockIndex + 1 : 0;
    const timestamp = new Date();

    // Calculate SHA-256 hash
    const hashData = `${nextIndex}-${timestamp.toISOString()}-${actorRole}-${category}-${action}-${previousBlockHash}-${details}`;
    const currentBlockHash = crypto.createHash('sha256').update(hashData).digest('hex');

    const newRecord = new AuditRecord({
      blockIndex: nextIndex,
      timestamp,
      actorRole,
      category,
      action,
      patientId,
      details,
      previousBlockHash,
      currentBlockHash,
    });

    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST verify audit ledger integrity
router.post('/verify', async (_req: Request, res: Response) => {
  try {
    const records = await AuditRecord.find().sort({ blockIndex: 1 });
    let isValid = true;
    let corruptedIndex = -1;

    for (let i = 1; i < records.length; i++) {
      const prev = records[i - 1];
      const curr = records[i];

      if (curr.previousBlockHash !== prev.currentBlockHash) {
        isValid = false;
        corruptedIndex = i;
        break;
      }
    }

    res.json({
      verified: isValid,
      totalBlocks: records.length,
      corruptedBlockIndex: corruptedIndex,
      lastHash: records.length > 0 ? records[records.length - 1].currentBlockHash : null,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
