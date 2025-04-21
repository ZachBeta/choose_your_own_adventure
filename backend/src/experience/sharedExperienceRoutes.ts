import { Router, Request, Response } from 'express';
import { SharedExperienceRequest, SharedExperienceResponse } from '../../../shared/types/sharedExperience';

const router = Router();

// POST /api/shared-experience
router.post('/', async (req: Request, res: Response) => {
  const body = req.body as SharedExperienceRequest;

  // Basic validation
  if (!body.channel_id || !body.channel_name || !body.user_id || !body.user_name) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  // TODO: Implement actual shared experience logic and persistence
  // For now, return a stubbed response
  const response: SharedExperienceResponse = {
    scene: `Welcome to the shared experience in ${body.channel_name}${body.thread_name ? ' / ' + body.thread_name : ''}!`,
    choices: [
      { id: 'choice_1', text: 'Explore the area' },
      { id: 'choice_2', text: 'Talk to the group' }
    ],
    participants: [body.user_id],
    history: [
      {
        user_id: body.user_id,
        user_name: body.user_name,
        action: body.action || 'joined',
        timestamp: new Date().toISOString()
      }
    ]
  };

  res.json(response);
});

export default router;
