# Implementation Roadmap: For a Mid-Level Engineer

This roadmap assumes familiarity with TypeScript, Node.js, Discord bots, and basic database concepts. It emphasizes modularity, code quality, and maintainability.

---

## Phase 1: Bootstrapping & Bot MVP
- Set up a new Discord bot using `discord.js` (TypeScript preferred).
- Organize code into modules: bot entrypoint, event handlers, and utilities.
- Implement listeners for @mentions and replies in the main channel, and all messages in threads.
- Add environment-based config for tokens and secrets.
- Write minimal tests (unit or integration) to verify bot event handling.

## Phase 2: API & Shared Types Integration
- Refactor or extend the API handlers (`experienceRoutes.ts`) to accept Discord context fields.
- Update OpenAPI spec and shared TypeScript types to reflect new multiplayer/context requirements.
- Ensure API endpoints are documented and easily testable (e.g., Swagger UI, Postman collections).
- Implement middleware for context extraction and validation.

## Phase 3: Persistence Layer
- Design normalized SQLite schema: `players`, `contexts`, `choices`, `narrative_nodes`.
- Implement a data access layer (DAL) with clear interfaces and error handling.
- Use migration scripts for schema changes and versioning.
- Integrate DAL into API handlers, replacing in-memory storage.
- Add tests for data layer logic and migrations.

## Phase 4: LLM Integration
- Abstract LLM calls behind a service layer (e.g., `llmService.ts`).
- Implement support for Deepseek V3 via OpenRouter, with config-driven model selection.
- Add retry logic and error handling for LLM API failures.
- Log prompt/response pairs for debugging and analysis (respect privacy/secrets).

## Phase 5: End-to-End Testing & Playtest Readiness
- Write end-to-end tests for core flows (bot → API → LLM → bot).
- Add logging and monitoring for bot and backend.
- Document setup, deployment, and troubleshooting steps.
- Run playtests, gather feedback, and iterate.

## Engineering Notes
- Prioritize modularity and separation of concerns.
- Use TypeScript types/interfaces for all data flows.
- Keep secrets/config out of source control.
- Plan for future model/backend swaps by keeping abstractions clean.
