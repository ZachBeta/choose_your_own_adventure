// Entry point for backend server

import express, { Request, Response } from 'express'
import cors from 'cors'
import { DialogService } from './dialogService'
import { LLMClient } from './llmClient'

const app = express()
app.use(cors(), express.json())

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
    res.status(400).json({ error: e.message })
  }
})

// GET /api/player/state?playerId=…
app.get('/api/player/state', (req: Request, res: Response) => {
  try {
    const { playerId } = req.query as any
    res.json(dialog.getPlayerState({ playerId }))
  } catch (e:any) {
    res.status(404).json({ error: e.message })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`))
