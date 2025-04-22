# Beginner's Tutorial: Building and Testing a Backend Endpoint for a Choose-Your-Own-Adventure App

**Audience:** Junior Software Engineers with basic knowledge of JavaScript/TypeScript, Node.js, and some web development experience.

---

## Introduction

In this tutorial, you'll learn how to build and test a backend API endpoint for a choose-your-own-adventure game. We'll go step-by-step, explaining each part so you can understand how everything works together.

---

## 1. What Are We Building?
- **Goal:** Create an API endpoint that lets players or groups play a story by making choices. The backend keeps track of what has happened and responds with the next part of the story.
- **Tools:**
  - Node.js and Express (for the backend server)
  - In-memory storage (just variables in code, no database yet)
  - A pretend "story engine" (could be a real AI or just some code that picks the next scene)

---

## 2. How Does It Work?
- The **frontend** (website or app) sends a request to the backend when a player makes a choice.
- The **backend** receives the request, figures out what should happen next, and sends back the new story scene and choices.
- The backend also keeps a short history of what happened, so the player or group can see their past choices.

---

## 3. Step-by-Step: Making the Endpoint

### a. Set Up Express
First, make sure you have Express installed. If not, run:
```sh
npm install express
```

Create a file called `server.js` (or `server.ts` if using TypeScript):

```js
const express = require('express');
const app = express();
app.use(express.json());

// We'll add our endpoint here soon

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

### b. Add In-Memory Storage
We'll use a simple object to keep track of each group's progress:

```js
const groupState = {};
```

### c. Create the Endpoint
Add this code to your server file:

```js
app.post('/api/shared-experience', (req, res) => {
  const { channel_id, user_id, action } = req.body;
  if (!channel_id || !user_id) {
    return res.status(400).json({ error: 'Missing channel_id or user_id' });
  }

  // Load or initialize state
  if (!groupState[channel_id]) {
    groupState[channel_id] = {
      scene: 'You are at the start of your adventure.',
      choices: [
        { id: 'choice_1', text: 'Go left' },
        { id: 'choice_2', text: 'Go right' }
      ],
      history: []
    };
  }

  // Process action if provided
  if (action) {
    groupState[channel_id].history.push({ user_id, action });
    // For now, just update the scene and choices simply
    groupState[channel_id].scene = `You chose ${action}. What next?`;
    groupState[channel_id].choices = [
      { id: 'choice_1', text: 'Keep going' },
      { id: 'choice_2', text: 'Go back' }
    ];
  }

  // Respond with current state
  res.json({
    scene: groupState[channel_id].scene,
    choices: groupState[channel_id].choices,
    history: groupState[channel_id].history
  });
});
```

### d. Test With curl
Open a terminal and run:

```sh
curl -X POST http://localhost:3000/api/shared-experience \
  -H "Content-Type: application/json" \
  -d '{
    "channel_id": "test_group",
    "user_id": "user_1",
    "action": "choice_1"
  }'
```

You should see a response with the scene, choices, and history. Try sending different actions to see how the story changes!

---

## 4. Tips for Junior Engineers
- **Always check for required fields** in the request.
- **Use `console.log`** to see what your server is doing.
- **Start simple**—you can add more features (like a real story engine or database) later.
- **Ask for help** if you get stuck! Teamwork is important.

---

## 5. Next Steps
- Try making the story more interesting by changing the scene/choices based on history.
- Learn how to use a database to save progress even if the server restarts.
- Work with your team to write tests and handle errors better.

---

*You’ve just built and tested your first backend API endpoint for an interactive story! Keep experimenting and learning.*
