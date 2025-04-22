# Backend Endpoint Implementation Plan

This document outlines a thorough plan for implementing real backend endpoints for your choose-your-own-adventure system, focusing on `/api/shared-experience` and `/api/experience`. It also covers how to test these endpoints using `curl`.

---

## 1. Endpoint Logic Overview

### a. State Management
- **Single-player:** Load narrative state (scene, choices, history) by user ID.
- **Group:** Load narrative state by channel/thread ID (for Discord or similar group contexts).

### b. Action Processing
- Validate and apply user actions/choices.
- Update narrative state, advance to the next scene/choices.
- Record the action and result in history.

### c. Persistence
- Use Data Access Layers (DALs) to store and retrieve state and history.
- If using in-memory storage, ensure correct keying by user or group.
- Plan for transition to persistent storage (SQL/NoSQL) if needed.

### d. LLM Integration
- Use prompt builder and LLM client to generate dynamic narrative content.
- Parse LLM output into structured nodes/scenes.

### e. Response Construction
- Return the current scene, choices, participants, and recent history in the OpenAPI-defined response format.

---

## 2. Implementation Steps

1. **Wire up the endpoint** to use a service layer and DALs for state/history management.
2. **Implement logic** for loading, updating, and saving state/history.
3. **Integrate prompt/LLM utilities** for dynamic content generation.
4. **Add error handling** for invalid actions, missing state, or unexpected input.
5. **Write unit and integration tests** (optional but recommended).

---

## 3. Example curl Commands for Testing

### a. POST /api/shared-experience

```
curl -X POST http://localhost:3000/api/shared-experience \
  -H "Content-Type: application/json" \
  -d '{
    "channel_id": "123456",
    "channel_name": "adventure-group",
    "user_id": "user_42",
    "user_name": "Alice",
    "action": "choice_1",
    "content": "I want to explore the area"
  }'
```

**Expected Response:**
```json
{
  "scene": "You step into the mysterious forest...",
  "choices": [
    { "id": "choice_1", "text": "Go deeper" },
    { "id": "choice_2", "text": "Return to camp" }
  ],
  "participants": ["user_42"],
  "history": [
    {
      "user_id": "user_42",
      "user_name": "Alice",
      "action": "choice_1",
      "timestamp": "2025-04-22T12:00:00Z"
    }
  ]
}
```

### b. Additional Test Cases
- **Initial scene load:** No action provided, should return the current state.
- **Valid action:** User selects a valid choice, state advances.
- **Invalid action:** User selects an invalid choice, expect an error response.
- **Multiple users:** Simulate multiple users in the same group/channel.
- **History retrieval:** Confirm that history reflects all actions taken.

---

## 4. Tips for Implementation & Testing

- **Log all requests and responses** for easier debugging and traceability.
- **Use environment variables** for configuration (API keys, DB URLs, etc.).
- **Validate all inputs** against your OpenAPI schema for robustness.
- **Document curl commands** for each endpoint and test scenario in your repo.
- **Add integration tests** to cover group and single-player flows, including edge cases.

---

## 5. Next Steps
- Implement the service layer logic for stateful narrative progression.
- Integrate DALs for reading/writing state and history.
- Use prompt builder and LLM client for generating narrative content.
- Test endpoints thoroughly using curl and automated tests.
- Plan for future migration to persistent storage if needed.

---

*This plan provides a thorough, step-by-step approach to delivering robust, testable backend endpoints for your adventure system.*
