# Tech Debt: Shared Types & Zod Schema Extraction (Paused)

## Summary
We began extracting core game types to `shared/types/` for use in both backend and frontend. Zod schemas in `shared/llmSchema.ts` were updated to reference these types, aiming to avoid type desync and provide a single source of truth for validation and type safety.

## Progress
- Interfaces for `SkillCheck`, `DialogOption`, `ThoughtCabinetEntry`, and `SceneResponse` were created in `shared/types/`.
- Zod schemas were refactored to use these interfaces as type parameters.
- Backend and frontend were updated to import from the shared types directory.

## Challenges
- Type conflicts arose due to differences in how backend, frontend, and shared types were structured—especially for nested objects and required fields.
- Backend startup issues likely stemmed from import cycles or mismatches introduced by the refactor.
- Vite/TypeScript environment typing issues surfaced in the frontend (unrelated, but encountered during this update).

## Lessons & Next Steps
- Type sharing is powerful but requires careful, incremental migration and thorough type checking.
- Full migration should be revisited after stabilizing other code paths or when more time is available for a deep refactor.
- See `shared/types/` and `shared/llmSchema.ts` for the current state of this effort.

## Action Items
- Pause further work on shared type extraction for now.
- Document this tech debt for future maintainers and revisit when the codebase is more stable.
