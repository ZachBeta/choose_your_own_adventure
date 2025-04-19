# Tutorial: Implementing Game History and Player Choices in the Frontend (Chatroom Style)

**Audience:** Midlevel Engineer

This guide explains how to persist and display the player's game history (monologues and choices) in a React-based CYOA frontend, using a chatroom-style UI with autoscroll.

---

## 1. Overview
- Maintain a `history` state in the React app.
- Record each monologue and player choice.
- Render the full history in a scrollable chat-like pane, with the latest messages always visible (autoscroll).
- Display the current dialog options as buttons at the bottom of the chat log.

## 2. State Management
- In your main component (e.g., `App.tsx`), add a `history` array to state:
  ```tsx
  const [history, setHistory] = useState<Array<{ monologue: string; choice?: string }>>([]);
  ```
- When a new scene is loaded, append the monologue to history.
- When a player makes a choice, update the last history entry with the choice, then append the next monologue.

## 3. Updating History
- After receiving a new scene from the backend:
  ```tsx
  setHistory(prev => [...prev, { monologue: scene.monologue }]);
  ```
- After a player selects an option:
  ```tsx
  setHistory(prev => {
    const last = prev[prev.length - 1];
    return [...prev.slice(0, -1), { ...last, choice: chosenOptionText }, { monologue: nextScene.monologue }];
  });
  ```

## 4. Rendering the Chatroom Log
- Use a scrollable container (e.g., a `<div>` with `overflowY: 'auto'` and a fixed height).
- Iterate over the `history` array:
  - For each entry, display the monologue as a narrator message.
  - If a `choice` exists, display it as a player message.
- Example:
  ```tsx
  <div ref={chatRef} style={{ height: '60vh', overflowY: 'auto', background: '#181820', padding: '1rem' }}>
    {history.map((entry, i) => (
      <div key={i}>
        <div style={{ color: '#fff', marginBottom: 4 }}>{entry.monologue}</div>
        {entry.choice && (
          <div style={{ color: '#39FF14', fontWeight: 'bold', marginBottom: 8 }}>&gt; {entry.choice}</div>
        )}
      </div>
    ))}
  </div>
  ```

## 5. Autoscroll to Latest Message
- Use a `ref` and `useEffect` to scroll to the bottom whenever history changes:
  ```tsx
  const chatRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [history]);
  ```

## 6. Showing Current Options
- Below the chat log, render the current dialog options as buttons:
  ```tsx
  {scene && scene.dialog.length > 0 && (
    <div style={{ marginTop: 16 }}>
      {scene.dialog.map(option => (
        <button key={option.id} onClick={() => handleChoose(option.id)} style={{ marginRight: 8 }}>
          {option.text}
        </button>
      ))}
    </div>
  )}
  ```

## 7. Styling Suggestions
- Use different colors/fonts for narrator vs. player.
- Add padding, rounded corners, and neon accents for a cyberpunk feel.

## 8. Example Combined Layout
```tsx
<div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
  <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', background: '#181820', padding: '1rem' }}>
    {/* Render history here */}
  </div>
  {/* Render options here */}
</div>
```

---

This approach creates an immersive, chatroom-like experience for your CYOA game, with seamless history tracking and player interaction.


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
