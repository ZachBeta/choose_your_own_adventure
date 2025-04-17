# Dialogue System: Implementation Task Breakdown

## 1. State Management
- [ ] Design and implement an in-memory state store keyed by `playerId`, tracking:
  - Current scene
  - Dialogue history (choices, outcomes)
  - Part XP and uses

## 2. API Method Implementations
- [ ] `startScene({ playerId, sceneId })`
  - Initialize new state or resume existing state
  - Generate initial prompt for LLM
  - Parse and store initial dialogue/options/parts

- [ ] `chooseOption({ playerId, optionId })`
  - Retrieve and update player state
  - Apply skill checks (with deterministic RNG in tests)
  - Update history, part XP/uses, and scene if needed
  - Generate next prompt for LLM and parse response

- [ ] `getPlayerState({ playerId })`
  - Return current state, including scene, history, and part stats

## 3. Skill Check Logic
- [ ] Implement deterministic skill check logic (seeded RNG for tests)
- [ ] Integrate skill check results into dialogue flow and state updates

## 4. LLM Integration
- [ ] Ensure all prompts to LLM are well-formed and include necessary context (scene, history, etc.)
- [ ] Parse and validate LLM responses (handle errors, ensure structure matches spec)
- [ ] Store raw LLM output internally for debugging

## 5. API Layer
- [ ] Expose the above methods via HTTP endpoints:
  - `POST /api/dialog` for both start and choose flows
  - `GET /api/player/state` for state inspection

## 6. Testing
- [ ] Write integration tests for the happy path scenario (as documented)
- [ ] Add tests for edge cases (invalid option, end-of-scene, etc.)
- [ ] Ensure tests use seeded RNG and real LLM

## 7. Documentation & Data
- [ ] Define and document concrete option IDs and part names for intro scene (and others)
- [ ] Document scene transitions and end-of-scene logic
- [ ] Update markdown docs as implementation evolves

---

### Optional/Advanced Tasks
- [ ] Add persistence (DB/file) for player state (for production)
- [ ] Implement admin/debug tools to inspect/modify player state
