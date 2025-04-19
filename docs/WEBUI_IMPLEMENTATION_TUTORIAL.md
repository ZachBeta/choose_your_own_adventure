# Building a Playable Web UI for CYOA: Step-by-Step Tutorial

This tutorial will guide you through building a play-testable web frontend for the "Choose Your Own Adventure" (CYOA) game. It is tailored for a midlevel engineer and assumes you have access to the existing backend and codebase.

---

## 1. Understand the Backend API

- The backend exposes two main endpoints:
  - `POST /api/dialog` — Start a scene or choose an option.
  - `GET /api/player/state` — Fetch the player’s history.
- Data shapes are defined in TypeScript (see `frontend/src/api/index.ts`).
- The CLI (`backend/bin/cli.ts`) demonstrates the game loop and input strategies (including “Luigi mode”).

---

## 2. Set Up the Frontend Project

- Scaffold a React + TypeScript app in `frontend/` (Vite recommended).
- Install dependencies:
  ```bash
  npm install react react-dom axios
  npm install -D typescript @types/react @types/react-dom
  ```
- Organize your frontend into:
  ```
  frontend/
    src/
      App.tsx
      api/index.ts
      components/Logo.tsx
      components/ScenePanel.tsx
      ...
  ```

---

## 3. Implement the API Layer

- In `src/api/index.ts`, define functions to call your backend endpoints and export the relevant types.
- Example:
  ```ts
  export async function startScene(playerId: string, sceneId: string): Promise<SceneResponse> { ... }
  export async function chooseOption(playerId: string, optionId: string): Promise<SceneResponse> { ... }
  export async function getPlayerState(playerId: string): Promise<PlayerState> { ... }
  ```

---

## 4. Build Core UI Components

- **Logo**: In `components/Logo.tsx`, render some ASCII art or a simple logo.
- **ScenePanel**: In `components/ScenePanel.tsx`, display the current monologue, thought cabinet, and dialog options.
- **App Layout**: In `App.tsx`, use a flexbox layout to display the logo on the left and the game text on the right.

---

## 5. Wire Up the Game Loop in React

- In `App.tsx`:
  - Store `scene`, `playerId`, and `history` in state.
  - On mount, call `startScene(playerId, 'scene_intro')`.
  - Render the current scene and dialog options.
  - When a choice is clicked, call `chooseOption` and update state.

---

## 6. Implement Luigi Mode (Auto-Advance)

- Add a checkbox or toggle for “Luigi does nothing”.
- When enabled, automatically pick the first dialog option after a short delay (simulate CLI Luigi mode).
  ```ts
  useEffect(() => {
    if (isLuigiMode && scene?.dialog?.length) {
      const timer = setTimeout(async () => {
        const firstId = scene.dialog[0].id;
        const next = await chooseOption(playerId, firstId);
        setScene(next);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [scene, isLuigiMode]);
  ```

---

## 7. Polish the UI

- Make sure the right panel (game text) is scrollable and readable.
- Style the left panel (logo) to be visually distinct.
- Optionally, add a history panel or dev/debug info.

---

## 8. Test and Iterate

- Play through the game in your browser.
- Compare the experience to the CLI.
- Share the URL with friends for feedback.

---

## 9. Deploy for Playtesting

- Deploy the frontend (and backend, if needed) to Vercel, Netlify, or similar for easy sharing.

---

## Example: Minimal App.tsx Skeleton

```tsx
import React, { useState, useEffect } from 'react';
import Logo from './components/Logo';
import ScenePanel from './components/ScenePanel';
import { startScene, chooseOption } from './api';

export default function App() {
  const [scene, setScene] = useState(null);
  const [isLuigiMode, setIsLuigiMode] = useState(false);
  const playerId = 'player1';

  useEffect(() => {
    startScene(playerId, 'scene_intro').then(setScene);
  }, []);

  useEffect(() => {
    if (isLuigiMode && scene?.dialog?.length) {
      const timer = setTimeout(async () => {
        const firstId = scene.dialog[0].id;
        const next = await chooseOption(playerId, firstId);
        setScene(next);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [scene, isLuigiMode]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '200px', background: '#f0f0f0', padding: '1rem' }}>
        <Logo />
        <label>
          <input
            type="checkbox"
            checked={isLuigiMode}
            onChange={e => setIsLuigiMode(e.target.checked)}
          /> Luigi does nothing
        </label>
      </div>
      <div style={{ flex: 1, padding: '1rem' }}>
        <ScenePanel scene={scene} />
      </div>
    </div>
  );
}
```

---

**Tips:**
- Keep your API types in sync with the backend.
- Use React state/hooks for all game state.
- Treat Luigi mode as a true “input strategy” — just like the CLI.
- Prioritize clarity and playability over perfect styling for playtesting.
