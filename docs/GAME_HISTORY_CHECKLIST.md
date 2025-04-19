# Game History Implementation Checklist

**Goal:** Persist and display the player’s game history (monologues and choices) in the React frontend.

---

## 1. State Management
- [ ] Add a `history` array to frontend state (e.g., in `App.tsx`)
- [ ] Define the shape: `{ monologue: string; choice?: string }[]`

## 2. Recording History
- [ ] On new scene/monologue from backend, append to `history`
- [ ] On player choice, update the last history entry with the chosen option

## 3. Displaying History
- [ ] Create a UI component (e.g., `HistoryPanel`) to display the history list
- [ ] Style the panel for readability and visual consistency

## 4. Integration
- [ ] Pass history state to relevant components
- [ ] Ensure history updates correctly with navigation and new game runs

## 5. Persistence (Optional)
- [ ] Persist history in localStorage or backend for session continuity

## 6. Testing
- [ ] Add unit/component tests for history logic and UI
- [ ] Manually verify correct recording and display of history

## 7. Documentation
- [ ] Update or cross-reference relevant docs:
  - [tutorial_game_history.md](./tutorial_game_history.md)
  - [WEBUI_IMPLEMENTATION_TUTORIAL.md](./WEBUI_IMPLEMENTATION_TUTORIAL.md)
  - [DIALOG_API_SPEC.md](./DIALOG_API_SPEC.md)
