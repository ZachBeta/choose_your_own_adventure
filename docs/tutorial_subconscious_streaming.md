# Tutorial: Subconscious Logging & Streaming for Debuggable LLM Apps

**Audience:** Mid-level Engineer  
**Goal:** Learn to expose and stream API and LLM “inner workings” to a debug/developer UI layer (“subconscious panel”) for rapid iteration and transparent troubleshooting.

---

## 1. What is Subconscious Logging?

In modern AI-driven apps, the “conscious” UI presents the main narrative and choices to the user. The “subconscious” layer, by contrast, is a debug/developer overlay that reveals the API’s inner workings—raw payloads, LLM responses, validation errors, and more. This layer is invaluable for:

- Rapid debugging and iteration
- Understanding model and API behavior
- Surfacing hidden errors or mismatches

---

## 2. Backend: Logging API Requests and LLM Responses

**Pattern:**  
Log all incoming API requests, outgoing responses, and any intermediate LLM or validation steps.

**Example (Express/TypeScript):**
```ts
app.post('/api/dialog', async (req, res) => {
  try {
    console.log('[API] IN:', JSON.stringify(req.body, null, 2));
    const { playerId, sceneId, optionId } = req.body;
    let out = sceneId
      ? await dialog.startScene({ playerId, sceneId })
      : await dialog.chooseOption({ playerId, optionId });
    console.log('[API] LLM RAW:', JSON.stringify(out.llmRaw, null, 2)); // If available
    console.log('[API] OUT:', JSON.stringify(out, null, 2));
    res.json(out);
  } catch (e) {
    console.error('[API] ERROR:', e);
    res.status(400).json({ error: e.message });
  }
});
```

---

## 3. Frontend: Surfacing the Subconscious Layer

**Pattern:**  
Display API requests, responses, and (optionally) LLM streaming output in a “subconscious panel” with a transparent/dev overlay style.

**Example (React):**
```tsx
function SubconsciousPanel({ lastApiPayload, lastApiResponse, llmStream }) {
  return (
    <div style={{
      fontFamily: 'monospace',
      fontSize: '0.9rem',
      color: 'rgba(255,255,255,0.3)',
      background: 'transparent',
      pointerEvents: 'none',
      userSelect: 'text'
    }}>
      <pre>{JSON.stringify(lastApiPayload, null, 2)}</pre>
      <pre>{JSON.stringify(lastApiResponse, null, 2)}</pre>
      {llmStream && <pre>{llmStream}</pre>}
    </div>
  );
}
```
**Tip:**  
Update `lastApiPayload` and `lastApiResponse` in your API call handlers. For advanced streaming, append to `llmStream` as new data arrives.

---

## 4. (Advanced) Streaming the Subconscious Layer

To show live LLM output as it’s generated:

- **Backend:**  
  - Implement streaming responses (e.g., using Server-Sent Events, HTTP chunked responses, or WebSockets).
- **Frontend:**  
  - Use `fetch` with a `ReadableStream` or a WebSocket client to append new data to the subconscious panel in real time.

**Example:**
```ts
// Backend: Express route using Server-Sent Events (SSE)
app.get('/api/dialog/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  // Stream LLM output here...
});
```
```tsx
// Frontend: Reading a stream
const response = await fetch('/api/dialog/stream');
const reader = response.body.getReader();
let llmStream = '';
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  llmStream += new TextDecoder().decode(value);
  // Update subconscious panel with llmStream
}
```

---

## 5. Fading Out the Subconscious Log (UX Enhancement)

To keep the UI clean but still debuggable, fade out subconscious logs after they finish streaming, but keep them in the DOM for inspection and autoscroll.

**Pattern:**
- Track log entry state: streaming or done.
- When streaming completes, start a timer to reduce opacity (CSS transition).
- Keep the entry in the DOM, just visually hide it.
- Autoscroll to the latest entry.

**Example (React):**
```tsx
import React, { useEffect, useRef, useState } from "react";

function SubconsciousLogEntry({ log, isStreaming }) {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (!isStreaming) {
      // Fade out over 2 seconds after streaming completes
      const timeout = setTimeout(() => setOpacity(0.1), 2000);
      return () => clearTimeout(timeout);
    } else {
      setOpacity(1); // Reset if new streaming starts
    }
  }, [isStreaming]);

  return (
    <pre
      style={{
        transition: "opacity 1s",
        opacity,
        fontFamily: "monospace",
        fontSize: "0.9rem",
        color: "rgba(255,255,255,0.3)",
        background: "transparent",
        margin: 0,
        pointerEvents: "none",
        userSelect: "text"
      }}
    >
      {log}
    </pre>
  );
}

function SubconsciousPanel({ logs }) {
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs.length]);

  return (
    <div style={{ maxHeight: 300, overflowY: "auto", position: "relative" }}>
      {logs.map((entry, i) => (
        <SubconsciousLogEntry
          key={i}
          log={entry.text}
          isStreaming={entry.isStreaming}
        />
      ))}
      <div ref={endRef} />
    </div>
  );
}
```

---

## 6. UI/UX Tips

- Keep the subconscious panel visually distinct but non-intrusive (e.g., low opacity, small font).
- Optionally, allow toggling or filtering the debug info.
- Never expose sensitive data in production—guard subconscious logging behind a dev/debug flag.

---

## 7. Benefits

- Faster debugging and iteration cycles
- More transparent AI and API behavior
- Easier onboarding for new developers

---

**Summary:**  
Subconscious logging and streaming make your app’s “inner workings” visible and debuggable, enabling rapid iteration and a deeper understanding of your LLM-powered system.

---
