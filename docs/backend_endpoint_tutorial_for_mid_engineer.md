# Tutorial: Implementing and Testing Backend Endpoints for a Narrative Adventure App

**Audience:** Mid-Level Software Engineers familiar with Node.js, TypeScript, and Express basics.

---

## Overview
This tutorial will guide you through building and testing backend endpoints for a choose-your-own-adventure application. You’ll learn how to manage game state, connect to a language model, and test your endpoints using `curl`.

---

## 1. Understanding the System
- **Frontend:** Sends requests to the backend when a player or group takes an action.
- **Backend:** Receives these requests, processes the action, updates the story, and responds with the next scene and choices.
- **Storage:** Keeps track of each player’s or group’s progress. (We start with in-memory storage.)
- **LLM (Language Model):** Generates new story content based on the game state and player choices.

---

## 2. Building the Endpoint

### a. Setting Up the Route
Create a new Express route for `/api/shared-experience`:

```ts
router.post('/api/shared-experience', async (req, res) => {
  const request = req.body;
  // 1. Check required fields (channel_id, user_id, etc.)
  // 2. Load current state for the group from storage
  // 3. If an action is included, update the state
  // 4. Use the language model to get the next scene and choices
  // 5. Save the updated state and history
  // 6. Return the new scene, choices, participants, and history
});
```

### b. Key Concepts
- **Validation:** Make sure the request has all the info you need (like channel_id and user_id).
- **State Management:** Store and retrieve the current scene and choices for each group or player.
- **Action Handling:** If a player makes a choice, update the story state.
- **LLM Integration:** Use a helper function to send the current state and action to the language model and get back the next part of the story.
- **Response:** Send back the new scene, available choices, and a history of actions.

---

## 3. Testing Your Endpoint with curl

### a. Example Request

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

### b. What to Check
- Does the API return a scene and choices?
- Does it update when you send a new action?
- Does it keep a history of what happened?
- What happens if you send a bad request (missing fields)?

---

## 4. Tips for Success
- **Log requests and responses** to help with debugging.
- **Handle errors** by sending clear error messages if something goes wrong.
- **Keep your code modular**—use helper functions for LLM calls and storage.
- **Write tests** for the main flows and edge cases.

---

## 5. Next Steps
- Try adding persistent storage (like a database) instead of in-memory.
- Add more detailed error handling and validation.
- Work with your team to review and improve the endpoint’s design.

---

*This tutorial will help you implement and test backend endpoints for interactive narrative experiences, preparing you for more advanced backend engineering tasks.*
