# Tutorial: Implementing and Testing Robust Backend Endpoints for a Narrative Adventure Platform

**Audience:** Senior Software Engineers familiar with Node.js, TypeScript, Express, LLM integration, and modern backend best practices.

---

## Overview
This tutorial guides you through implementing production-grade endpoints for a group/solo narrative adventure backend. You’ll leverage modular service layers, DALs, and LLM integration, and learn how to test endpoints with `curl` and automated strategies.

---

## 1. Architecture Recap
- **Frontend:** Sends OpenAPI-compliant requests (single/group play).
- **Backend:** Handles `/api/experience` (solo) and `/api/shared-experience` (group), using modular services and DALs.
- **Storage:** In-memory DALs, ready for persistent upgrade.
- **LLM Integration:** Prompt builder, parser, and LLM client for dynamic content.

---

## 2. Endpoint Implementation Best Practices

### a. Service Layer Pattern
- Encapsulate business logic (state transitions, validation, LLM calls) in a dedicated service class (e.g., `SharedExperienceService`).
- Inject DALs and prompt utilities for testability and flexibility.

### b. State & Action Management
- Load state by context (user for solo, channel/thread for group).
- Validate and apply actions atomically; ensure correct handling of concurrent group actions.
- Record all state transitions and actions in history logs.

### c. LLM Integration
- Use prompt builder to assemble context-rich prompts.
- Call LLM client and parse responses into structured nodes/scenes.
- Handle LLM errors gracefully (timeouts, invalid output, etc.).

### d. Persistence
- Start with in-memory DALs; design interfaces to allow seamless migration to SQL/NoSQL.
- Key group state by channel/thread, solo state by user.

### e. API Contract
- Strictly follow your OpenAPI spec for request/response payloads.
- Return clear errors for invalid actions or malformed input.

---

## 3. Example: Implementing `/api/shared-experience`

```ts
// Pseudocode outline
router.post('/api/shared-experience', async (req, res) => {
  const request = req.body;
  // 1. Validate input (channel_id, user_id, etc.)
  // 2. Load group state from DAL
  // 3. If action is present, process and update state
  // 4. Generate new scene/choices with LLM if needed
  // 5. Store updated state/history
  // 6. Respond with scene, choices, participants, history
});
```

---

## 4. Testing with curl

### a. Basic Usage

```sh
curl -X POST http://localhost:3000/api/shared-experience \
  -H "Content-Type: application/json" \
  -d '{
    "channel_id": "chan_001",
    "channel_name": "adventure-group",
    "user_id": "user_42",
    "user_name": "Alice",
    "action": "choice_1",
    "content": "I want to explore the area"
  }'
```

### b. Test Scenarios
- Initial scene load (no action)
- Valid action/choice
- Invalid action (expect error)
- Multiple users in group
- History validation

### c. Automation
- Use `npm test` or similar to automate endpoint tests.
- Mock LLM responses for deterministic tests.

---

## 5. Advanced Topics
- **Concurrency:** Use locks or atomic updates to handle simultaneous group actions.
- **Persistence:** Swap in SQL/NoSQL DALs for production.
- **Observability:** Add structured logging and metrics for debugging and monitoring.
- **Security:** Validate all input, sanitize content, and secure API keys.

---

## 6. Checklist for Production Readiness
- [ ] Service layer and DALs are modular and testable
- [ ] LLM integration is robust and error-tolerant
- [ ] All endpoints validated against OpenAPI schema
- [ ] End-to-end and integration tests cover group and solo flows
- [ ] Logging, error handling, and monitoring are in place

---

## 7. References
- [OpenAPI Spec](../openapi.shared-experience.yaml)
- [DAL Implementations](../backend/src/services/storage/)
- [Prompt & LLM Utilities](../backend/src/PromptBuilder.ts, ../backend/src/llmClient.ts)

---

*This tutorial provides a senior-level blueprint for building, extending, and testing a narrative adventure backend with modern best practices.*
