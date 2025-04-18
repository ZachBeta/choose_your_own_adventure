# Testing & Acceptance Decisions

## Overview
This document records the key decisions and strategies for testing the dialog/skill check system and related CLI/backend logic for the Cyberpunk CYOA project.

---

## Testing Approach

- **Language/Stack:** Fullstack TypeScript (Node.js/Express backend, CLI prototype, future web frontend)
- **Testing Framework:** Jest (or Vitest) for unit, integration, and acceptance tests
- **Deterministic Randomness:**
  - Acceptance tests will lock the random seed (e.g., using `seedrandom`) to ensure repeatable dice rolls and outcomes.
  - In development and production, true randomness will be used for authentic player experience.
- **AI/Model Output:**
  - During acceptance tests, model temperature will be fixed or mocked/stubbed to prevent non-deterministic output.

---

## Acceptance Test Scenarios

1. **Display of Scene and Options:**
   - Monologue, thought cabinet voices, and dialog options (with Parts and DCs) are displayed clearly.
   - Silent Parts are shown as inactive.
2. **Skill Check Resolution:**
   - d20 roll + Part score vs DC; outcome and narrative displayed.
3. **Critical Success/Failure:**
   - Natural 20 always succeeds (critical), natural 1 always fails (critical).
4. **No Skill Check Option:**
   - Option with no check advances scene or shows narrative.
5. **Part Leveling:**
   - Parts gain XP with use; level up when threshold reached; CLI displays level-up.
6. **XP and Uses Tracking:**
   - XP, level, and uses are updated and shown per Part.
7. **History View:**
   - Player can view a chronological list of past actions, rolls, and outcomes.
8. **Error Handling:**
   - Invalid input results in clear error messages and reprompt.
9. **State Persistence (Optional):**
   - Player can resume from last state if implemented.

---

## Example Test Implementation

- Tests will use a deterministic RNG for dice rolls:
  ```ts
  import seedrandom from 'seedrandom';
  const rng = seedrandom('test-seed');
  const roll = Math.floor(rng() * 20) + 1;
  ```
- Skill check logic will be tested for normal, critical success, and critical failure cases.
- Leveling and XP logic will be tested by simulating repeated Part use.
- CLI and backend modules will be tested for correct output and state transitions.

---

## Rationale

- Deterministic tests ensure reliability and make debugging easier.
- Fullstack TS keeps code and tests consistent across CLI, backend, and frontend.
- Acceptance tests mirror the player experience and support rapid prototyping.

---

_Last updated: 2025-04-16_
