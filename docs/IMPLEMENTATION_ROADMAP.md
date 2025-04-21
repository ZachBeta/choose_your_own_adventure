# Implementation Roadmap: Discord Choose-Your-Own-Adventure MVP

This document outlines a phased implementation plan for building the Discord-based choose-your-own-adventure game. It is written for a junior-level developer and includes clear steps, goals, and tips for each phase.

---

## Phase 1: Project Setup & Bot MVP

**Goal:** Set up the codebase and create a simple Discord bot that can listen and respond in the main channel and threads.

### Steps:
1. **Clone the repo and install dependencies**
   - Run `npm install` in the project root.
2. **Set up Discord bot credentials**
   - Create a bot on the Discord Developer Portal.
   - Add your bot token to a `.env` file as `DISCORD_BOT_TOKEN`.
3. **Create a basic bot script** (e.g., `backend/bot.ts`)
   - Use `discord.js` to connect to Discord.
   - Listen for @mentions and replies in the main channel.
   - Listen for all messages in threads the bot is added to.
   - Reply with a simple message (e.g., "Bot is listening!").
4. **Test the bot**
   - Run the bot locally and verify it responds in the right places.

---

## Phase 2: Backend API & Types

**Goal:** Define and update the API and types to support multiplayer and Discord context.

### Steps:
1. **Update OpenAPI spec (`openapi.v1.yaml`)**
   - Add optional fields: `user_id`, `user_name`, `channel_id`, `channel_name`, `thread_id`, `thread_name` to requests and responses.
2. **Update TypeScript types**
   - Edit `shared/types/experience.ts` to match the new API fields.
3. **Update API handlers** (`backend/src/experience/experienceRoutes.ts`)
   - Accept and process Discord context fields in API routes.
   - For now, keep all data in memory (no database yet).
4. **Test API endpoints**
   - Use Postman or curl to send requests and check responses.

---

## Phase 3: Persistence with SQLite

**Goal:** Add persistent storage for player and game state.

### Steps:
1. **Design SQLite schema**
   - Tables: `players`, `contexts`, `choices`, `narrative_nodes`.
2. **Write migration scripts** (`backend/migrations/`)
   - Use a migration tool or raw SQL files.
3. **Implement data access layer**
   - Create TypeScript modules for CRUD operations on each table.
4. **Integrate storage with API handlers**
   - Update routes to read/write from the database.
5. **Test persistence**
   - Restart the server and verify data is saved.

---

## Phase 4: LLM Integration (Deepseek V3 via OpenRouter)

**Goal:** Enable narrative generation using Deepseek V3.

### Steps:
1. **Create an LLM service module** (e.g., `backend/src/llm/deepseek.ts`)
   - Use `axios` to call the OpenRouter API.
   - Add your OpenRouter API key to `.env` as `OPENROUTER_API_KEY`.
2. **Wire LLM calls into narrative logic**
   - When a user makes a choice, send context to the LLM and return its response.
3. **Test narrative generation**
   - Try making choices in Discord and see LLM-generated story text.

---

## Phase 5: Polish & Playtesting

**Goal:** Refine the user experience and fix bugs.

### Steps:
1. **Improve error handling and logging**
2. **Write documentation for setup and usage**
3. **Invite friends or teammates to playtest**
4. **Collect feedback and iterate on features**

---

## Tips for Success
- Work in small, testable increments.
- Ask for help if you get stuck on Discord.js, TypeScript, or SQL.
- Use environment variables for all secrets (bot tokens, API keys).
- Keep code and documentation up-to-date as you go.

---

By following this roadmap, you’ll build a robust, flexible Discord choose-your-own-adventure MVP ready for multiplayer storytelling and future expansion.
