# Implementation Checklist

A step-by-step list to get the full stack running and wired up.

## Backend Setup
- [ ] cd backend && npm install
- [ ] Ensure backend LLM is available:
  - Ollama (`ollama serve` / `ollama run gemma3:12b`)
  - or set `OPENROUTER_API_KEY`
- [ ] npm start (launch API on port 3000)

## Frontend Scaffold
- [ ] cd frontend && npm install
- [ ] Add scripts to `frontend/package.json`:
  ```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
  ```
- [ ] Create `frontend/tsconfig.json`
- [ ] Create `frontend/vite.config.ts`
- [ ] Create `frontend/public/index.html`
- [ ] Create `frontend/src/main.tsx`
- [ ] Create minimal CSS at `frontend/src/styles/index.css`

## Environment
- [ ] Copy `frontend/.env.example` → `frontend/.env`
- [ ] Set `VITE_API_BASE_URL=http://localhost:3000`

## API Layer
- [ ] Verify `startScene`, `chooseOption`, `getPlayerState` in `frontend/src/api/index.ts`
- [ ] Types match backend `SceneResponse` & `PlayerState`

## UI Components & Game Loop
- [ ] Update `App.tsx`:
  - [ ] Manage `scene` & `isLuigiMode` state
  - [ ] Call `startScene` on mount
  - [ ] Luigi auto-advance effect
  - [ ] `handleChoice` function
- [ ] Update `ScenePanel.tsx`:
  - [ ] Accept `onChoose` prop
  - [ ] Render clickable dialog options
- [ ] Verify `Logo.tsx` exists and renders ASCII logo

## Test & Iterate
- [ ] Run backend tests (`npm test`)
- [ ] Run frontend (`npm run dev`) and click through UI
- [ ] Toggle Luigi mode and verify auto-play

## Deploy
- [ ] Deploy frontend & backend to Vercel/Netlify or similar
- [ ] Share URL for playtesting
