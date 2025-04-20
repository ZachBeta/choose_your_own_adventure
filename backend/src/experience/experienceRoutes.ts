import { Router } from 'express';
import { ExperienceService } from '../services/experienceService';
import { ExperienceNodeStorage } from '../services/storage/ExperienceNodeStorage';
import { HistoryEntryStorage } from '../services/storage/HistoryEntryStorage';
import { ExperiencePrompt } from './experiencePrompt';
import { logger } from '../utils/logger';
import { ExperienceRequest } from '../../../shared/types/experience';

const router = Router();

// Initialize storage and services
const nodeStorage = new ExperienceNodeStorage();
const historyStorage = new HistoryEntryStorage();
const experiencePrompt = new ExperiencePrompt();
const experienceService = new ExperienceService(
  nodeStorage,
  historyStorage,
  experiencePrompt
);

router.post('/experience', async (req, res) => {
  try {
    const request: ExperienceRequest = req.body;
    const nextNode = await experienceService.generateNextExperience(request.selectedAction);
    res.json(nextNode);
  } catch (error) {
    logger.error('Failed to generate next experience:', error);
    res.status(400).json({ error: 'Failed to generate next experience' });
  }
});

export default router; 