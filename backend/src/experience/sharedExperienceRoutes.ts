import { Router, Request, Response } from 'express';
import { SharedExperienceRequest, SharedExperienceResponse } from '../../../shared/types/sharedExperience';
import { ExperienceNodeStorage } from '../services/storage/ExperienceNodeStorage';
import { HistoryEntryStorage } from '../services/storage/HistoryEntryStorage';
import { SharedExperiencePrompt } from './SharedExperiencePrompt';
import { SharedExperienceService } from '../services/SharedExperienceService';

const router = Router();

// Initialize service and storage
const nodeStorage = new ExperienceNodeStorage();
const historyStorage = new HistoryEntryStorage();
const sharedPrompt = new SharedExperiencePrompt();
const sharedService = new SharedExperienceService(nodeStorage, historyStorage, sharedPrompt);

// POST /api/shared-experience
router.post('/', async (req: Request, res: Response) => {
  const request = req.body as SharedExperienceRequest;
  // Basic validation
  if (!request.channel_id || !request.channel_name || !request.user_id || !request.user_name) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  try {
    const result = await sharedService.handleRequest(request);
    res.json(result);
  } catch (err) {
    console.error('Error in shared-experience:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
