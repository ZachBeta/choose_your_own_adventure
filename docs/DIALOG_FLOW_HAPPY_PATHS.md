# Dialogue System Happy Path Scenarios

## Overview
This document outlines a concrete happy path scenario for the dialogue system, including tracked state, API usage, and expected state after each step. It is intended to guide both implementation and integration testing.

---

## State Model
- **Scene**: The current scene or narrative context for the player.
- **Dialogue History**: Chronological list of choices made and outcomes.
- **Part XP and Uses**: Tracks experience and usage count for each 'Part' (e.g., Joy, Sadness).

---

## API Methods
- `startScene({ playerId, sceneId })` — Initializes or resumes a scene for a player.
- `chooseOption({ playerId, optionId })` — Progresses the scene based on the chosen option.
- `getPlayerState({ playerId })` — Returns current state for the player (for debugging/testing).

---

## Randomness & LLM Policy
- **Seeded RNG** for all tests; true randomness in development/production.
- **Real LLM** is always used (no mocking/stubbing in tests).
- **Raw LLM output** is stored internally, but not returned in API responses.

---

## Happy Path Scenario 1: Intro Scene, Multi-Turn Dialogue

### Context
Player starts at the intro scene. They make two sequential choices: one with a skill check and one without.

### Step 1: Start Scene
- **API Call:**
  ```json
  POST /api/dialog
  {
    "playerId": "player1",
    "sceneId": "scene_intro"
  }
  ```
- **Expected Response:**
  - `monologue`: string
  - `thoughtCabinet`: array of parts/thoughts
  - `dialog`: array of options (at least one with a skill check)
- **State after step:**
  - Scene: `scene_intro`
  - Dialogue history: empty
  - Part XP/uses: initial values

### Step 2: Choose Option A (with skill check)
- **API Call:**
  ```json
  POST /api/dialog
  {
    "playerId": "player1",
    "optionId": "optionA"
  }
  ```
- **Expected Response:**
  - `monologue`: string
  - `thoughtCabinet`: updated
  - `dialog`: new options
  - `skillCheckResult`: object (shows roll, part, DC, outcome, etc.)
- **State after step:**
  - Scene: updated if option transitions
  - Dialogue history: 1 entry (optionA, skill check result)
  - Part XP/uses: incremented for used part

### Step 3: Choose Option B (no skill check)
- **API Call:**
  ```json
  POST /api/dialog
  {
    "playerId": "player1",
    "optionId": "optionB"
  }
  ```
- **Expected Response:**
  - `monologue`: string
  - `thoughtCabinet`: updated
  - `dialog`: new options or end of scene
  - `skillCheckResult`: absent or null
- **State after step:**
  - Scene: updated if option transitions
  - Dialogue history: 2 entries (optionA, optionB)
  - Part XP/uses: incremented if relevant

### Step 4: Inspect Player State
- **API Call:**
  ```json
  GET /api/player/state?playerId=player1
  ```
- **Expected Response:**
  - `scene`: current scene
  - `history`: [optionA, optionB, ...]
  - `parts`: XP/uses for each part

---

## Open Questions / TODOs
- What are the concrete option IDs and part names for the intro scene?
- How should we handle scene transitions and end-of-scene logic?
- What additional edge cases should be documented?
