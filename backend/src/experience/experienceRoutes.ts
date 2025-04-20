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
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const request: ExperienceRequest = req.body;
    
    // Send initial status
    res.write(`data: ${JSON.stringify({ type: 'status', status: 'started' })}\n\n`);

    // Create stream handler
    const streamHandler = (chunk: string) => {
      res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
    };

    const nextNode = await experienceService.generateNextExperience(
      request.selectedAction,
      streamHandler
    );

    // Send final complete node
    res.write(`data: ${JSON.stringify({ type: 'complete', node: nextNode })}\n\n`);
    res.end();
  } catch (error) {
    logger.error('Failed to generate next experience:', error);
    res.write(`data: ${JSON.stringify({ type: 'error', error: 'Failed to generate next experience' })}\n\n`);
    res.end();
  }
});

export default router; 