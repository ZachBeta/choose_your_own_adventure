# Bot Requirements: Message Splitting, Reply Targeting, and Mentions

This document captures the requirements and intended behaviors for the Discord bot in `bot/bot.ts`. It is based on the full git history and project discussions.

---

## 1. Message Length & Splitting
- **Limit:** Never exceed Discord’s message length limit (default: 2000 characters).
- **Splitting:**
  - Prefer to split at line breaks (\n) for readability.
  - If a single line exceeds the limit, split at the character limit.
  - Only split when necessary; if the combined message is under the limit, send as one message.

## 2. Message Content Formatting
- **Scene & Choices:**
  - Combine the scene and choices into a single message, separated by a line break.
  - If the combined message is too long, split as above.
  - Choices should be formatted as:
    ```
    **Choices:**
    `id`: choice text
    ...
    ```

## 3. Mentions Handling
- **Mentions in Replies:**
  - Replace raw Discord user mentions (e.g., `<@id>`) with human-readable display names (e.g., `@username`).
  - Use a cache to minimize API calls for display names.
  - If a display name cannot be resolved, use `@unknown:USER_ID`.

## 4. Reply Targeting
- **Threading:**
  - Always reply in the same thread or channel as the original message.
  - For DMs, reply directly to the user.

## 5. Error Handling
- If the backend API call fails, reply with a user-friendly error message.

## 6. General Principles
- Keep logic for splitting, formatting, and mention replacement as clear and isolated as possible for future maintainability.
- Document any changes to this behavior in this file.

---

_Last updated: 2025-04-23_
