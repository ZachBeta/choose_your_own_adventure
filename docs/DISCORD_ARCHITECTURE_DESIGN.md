# Discord Choose-Your-Own-Adventure: Architecture & Design Discussion

## Overview
This document thoroughly summarizes the architectural and design decisions discussed for the next iteration of the multiplayer choose-your-own-adventure game, targeting Discord as the primary interface for the MVP.

---

## Vision & Gameplay Model
- Players spawn at unique points in a narrative tree/graph and can, through decisions, intersect with other players.
- The narrative is structured as a directed graph of experiences and choices, with players' paths tracked individually and collectively.
- Discord is leveraged for multiplayer:
    - **Main channel** = global world
    - **Threads** = dungeons or side quests
    - **DMs** = player's internal dialogue, stat/personality management

## Interaction Model
- MVP will use replies and @mentions for making choices.
    - For group decisions: "first in wins" (or "last in wins" with a timer, as a possible future enhancement)
- The bot provides feedback and presents new choices in the relevant Discord context.

## API & Data Model
- API defined in `openapi.v1.yaml` (to be updated):
    - Endpoints for reading current scene, submitting choices, and (optionally) fetching player stats.
    - Both requests and responses will include the following optional Discord context fields:
        - `user_id`, `user_name`, `channel_id`, `channel_name`, `thread_id`, `thread_name`
    - These fields allow the backend to distinguish between global (channel), group (thread), and individual (DM) contexts.
- TypeScript types in `shared/types/experience.ts` will be updated accordingly.

## Backend Logic
- API handlers in `backend/src/experience/experienceRoutes.ts` will:
    - Accept Discord context fields and pass them through to the business logic.
    - Use context to determine which narrative node to fetch/update for a player or group.
    - Route requests appropriately for multiplayer and single-player flows.
- Future abstraction: Context fields are optional, enabling future support for other platforms or more abstracted context management.

## Persistence & Storage
- SQLite will be used for persistent storage (migrations in `backend/migrations/`).
- Key tables:
    - `players` (user_id, user_name, stats, current_node, etc.)
    - `contexts` (channel_id, thread_id, current_node, etc.)
    - `choices` (choice_id, context, user_id, selected_option, timestamp)
    - `narrative_nodes` (node_id, scene_text, options/links)
    - (Optional) `global_state` for world-altering events
- Data access layer will provide CRUD operations for these tables and be integrated into the backend logic.

## Discord Bot Integration
- A working Discord bot prototype exists at [ruby_ai_llm_bot_for_good_discord](https://github.com/ZachBeta/ruby_ai_llm_bot_for_good_discord).
- The bot will interact with the backend API, sending context-rich requests and displaying narrative updates/choices in Discord.
- The architecture keeps the bot as a thin client, with all game logic and state managed by the backend API.

## Implementation Steps
1. Update OpenAPI spec and TypeScript types to include Discord context fields.
2. Refactor API handlers to accept and use context fields.
3. Design and migrate the SQLite schema for persistent storage.
4. Implement data access layer and integrate with backend logic.
5. Test end-to-end with the Discord bot, iterating on narrative content and UX.

## Design Philosophy
- Minimalist MVP, with clear separation of concerns between Discord interface and backend logic.
- Extensible and abstracted design to support future expansions (other platforms, richer context management, etc.).
- Focus on rapid iteration and playtesting, with persistence and multiplayer as core features.

---

This document serves as a comprehensive reference for the current state and future direction of the Discord-based choose-your-own-adventure project.
