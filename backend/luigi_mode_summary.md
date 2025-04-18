# Luigi Mode ("Do Nothing and Win") Implementation Summary

## Overview

This effort focused on implementing an automated CLI mode for the choose-your-own-adventure game, inspired by the meme "Luigi wins Mario Party by doing nothing." In this mode, the game plays itself by always selecting the first available dialog option, allowing for hands-free, deterministic playthroughs. This was designed to help with debugging, UX evaluation, and fun-factor assessment via automated, observable game sessions.

---

## Key Features & Steps

### 1. CLI Flag for Luigi Mode
- Added `--mario-party-luigi` and alias `--luigi` to the CLI (`bin/cli.ts`).
- When either flag is present, the CLI:
  - Sets the player name to `luigi`.
  - Sets the scene to `mario party`.
  - Uses a special input strategy that always selects the first dialog option.

### 2. Input Strategy Pattern
- Introduced an `InputStrategy` interface:
  - `UserInputStrategy`: prompts the user for input.
  - `LuigiInputStrategy`: always returns `0` (first option).
- The main game loop is agnostic to how input is chosen, enabling future extensions (e.g., random, scripted, test fixtures).

### 3. Observability
- In Luigi mode, all backend prompts and responses are logged to the console for transparency and debugging.
- The groundwork is laid for future enhancements, such as matrix-style streaming logs and colored UI overlays.

### 4. Robust CLI Flag Handling
- Ensured that CLI arguments are correctly parsed, including npm script nuances (requiring `--` before flags).
- Improved variable naming and log messages for clarity.

---

## Lessons Learned
- **npm script flags:** Extra arguments must be passed after `--` (e.g., `npm run play -- --luigi`).
- **Separation of concerns:** The input strategy pattern makes the codebase more testable and extensible.
- **Automated playthroughs:** Luigi mode enables quick, repeatable, and observable game runs for debugging and UX research.

---

## Next Steps / Future Ideas
- Implement matrix-style logging (muted green, streaming effect) for backend responses in the CLI.
- Add colored UI overlays for thoughts, monologue, and dialog options for better readability and fun.
- Expand Luigi mode with additional strategies (random, replay, test fixtures).
- Use Luigi mode for snapshot testing and gameplay recording.

---

## Example Usage

```sh
npm run play -- --luigi
# or
npx ts-node bin/cli.ts --luigi
```

---

## Contributors
- Design, implementation, and testing: Zach & Cascade AI

---

This mode is a foundation for more robust, automated, and fun game development workflows!
