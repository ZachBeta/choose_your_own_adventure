// Entry point for backend server

import express, { Request, Response } from 'express'
import cors from 'cors'
import { DialogService } from './dialogService'
import { LLMClient } from './llmClient'
import { logInfo, logError } from './logger';

const app = express()
app.use(cors(), express.json())

// Middleware to log all requests and responses
app.use((req, res, next) => {
  logInfo('API Request', {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    query: req.query,
    headers: req.headers
  });
  // Capture response
  const oldJson = res.json;
  res.json = function (data: any) {
    logInfo('API Response', {
      method: req.method,
      url: req.originalUrl,
      response: data
    });
    return oldJson.call(this, data);
  };
  next();
});

const dialog = new DialogService({ llm: new LLMClient() })

// POST /api/dialog  { playerId, sceneId? , optionId? }
app.post('/api/dialog', async (req: Request, res: Response) => {
  try {
    const { playerId, sceneId, optionId } = req.body
    let out = sceneId
      ? await dialog.startScene({ playerId, sceneId })
      : await dialog.chooseOption({ playerId, optionId })
    res.json(out)
  } catch (e:any) {
    logError('API Error', { endpoint: '/api/dialog', error: e.message });
    res.status(400).json({ error: e.message })
  }
})

// GET /api/player/state?playerId=…
app.get('/api/player/state', (req: Request, res: Response) => {
  try {
    const { playerId } = req.query as any
    res.json(dialog.getPlayerState({ playerId }))
  } catch (e:any) {
    logError('API Error', { endpoint: '/api/player/state', error: e.message });
    res.status(404).json({ error: e.message })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`))
