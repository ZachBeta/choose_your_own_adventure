# Tutorial: Implementing Game History and Player Choices in the Frontend

**Audience:** Midlevel Engineer

This guide explains how to persist and display the player's game history (monologues and choices) in a React-based CYOA frontend.

---

## 1. Overview
- Maintain a `history` state in the React app.
- Record each monologue and player choice.
- Display the history in a sidebar or dedicated panel.

## 2. State Management
- In your main component (e.g., `App.tsx`), add a `history` array to state:
  ```tsx
  const [history, setHistory] = useState<Array<{ monologue: string; choice?: string }>>([]);
  ```
- When a new scene is loaded, append the monologue to history.
- When a player makes a choice, append the choice text to history.

## 3. Updating History
- After receiving a new scene from the backend:
  ```tsx
  setHistory(prev => [...prev, { monologue: scene.monologue }]);
  ```
- After a player selects an option:
  ```tsx
  setHistory(prev => {
    const last = prev[prev.length - 1];
    return [...prev.slice(0, -1), { ...last, choice: chosenOptionText }];
  });
  ```

## 4. Displaying History
- Create a `HistoryPanel` component:
  ```tsx
  function HistoryPanel({ history }) {
    return (
      <div className="history-panel">
        {history.map((entry, i) => (
          <div key={i}>
            <div className="history-monologue">{entry.monologue}</div>
            {entry.choice && <div className="history-choice">&gt; {entry.choice}</div>}
          </div>
        ))}
      </div>
    );
  }
  ```
- Style the panel for readability and cyberpunk vibes.

## 5. Integration
- Place `HistoryPanel` in your sidebar or as a floating box.
- Pass the `history` state as a prop.

## 6. Tips
- Keep history updates in sync with scene and choice transitions.
- Optionally, fetch history from backend if you want persistence across reloads.

---

By following this guide, your game will display a running log of the player's journey, enhancing immersion and replayability.
