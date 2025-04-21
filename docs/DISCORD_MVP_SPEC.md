# Discord Choose-Your-Own-Adventure Bot: MVP Plan & Specifications

## Overview
This document outlines the plan and technical specifications for the MVP of a Discord-based choose-your-own-adventure game with multiplayer features. The design leverages Discord's channels, threads, and DMs to create a cyberpunk-themed narrative experience.

---

## Gameplay Structure
- **Main Channel**: Represents the "global" world where all players can interact and make choices affecting the shared narrative.
- **Threads**: Serve as "dungeons" or side quests, providing isolated narrative branches for smaller groups.
- **DMs**: Used for individual player internal dialogue, personality/stat adjustments, and private narrative moments.

## Player Experience
- Players interact with the bot via replies and @mentions in channels/threads.
- For MVP, choices are resolved as "first in wins" (the first valid reply determines the party's action).
- The bot provides narrative feedback and presents new choices as the story progresses.

## Narrative Model
- The story is structured as a traditional tree/graph of experiences and decisions.
- Each player's path is tracked through the tree, with the possibility of intersecting with other players' paths.

## Persistence
- All game state (player positions, stats, choices, etc.) is stored in a lightweight SQLite database for reliability and iterative testing.

## API & Data Model (OpenAPI Spec)
- The API exposes endpoints for reading and writing the current scene ("experience") and making choices.
- Both request and response schemas for relevant endpoints will include the following **optional** Discord context fields:
  - `user_id`
  - `user_name`
  - `channel_id`
  - `channel_name`
  - `thread_id`
  - `thread_name`
- These fields allow the game master bot to track narrative state across different Discord spaces.
- The fields are optional to support future abstraction and possible expansion to other platforms.

## Next Steps
1. Update `openapi.v1.yaml` to include the Discord fields in the appropriate models/endpoints.
2. Implement the MVP bot logic to:
    - Parse Discord messages and map them to API requests.
    - Track and resolve choices per channel/thread/DM context.
    - Persist and retrieve game state from SQLite.
3. Iterate on narrative content and user experience based on playtesting feedback.

---

This plan ensures a focused, minimalist MVP while providing a foundation for future expansion and abstraction.
