# Tutorial: Building a Matrix-Style LLM Loader in React

**Audience:** Midlevel Engineer

This guide explains how to create a Matrix-style streaming loader for LLM responses in a React frontend, providing immersive feedback while waiting for the AI.

---

## 1. Overview
- Show a neon green, Matrix-inspired animation while the LLM is processing.
- Stream the actual LLM response character-by-character for extra immersion.

## 2. Component Design
- Create a `MatrixMonologueLoader` React component:
  - Props: `text` (string), `loading` (boolean)
  - State: `displayedText` (string)
  - Use `setInterval` to reveal one character at a time when `loading` is true.

## 3. Example Implementation
```tsx
import React, { useEffect, useState } from 'react';

export function MatrixMonologueLoader({ text, loading }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    if (!loading) { setDisplayed(text); return; }
    setDisplayed('');
    let i = 0;
    const timer = setInterval(() => {
      setDisplayed(prev => prev + text[i]);
      i++;
      if (i >= text.length) clearInterval(timer);
    }, 18); // adjust speed as desired
    return () => clearInterval(timer);
  }, [text, loading]);
  return (
    <pre className="matrix-monologue">{displayed}</pre>
  );
}
```

## 4. Styling
Add this to your CSS:
```css
.matrix-monologue {
  font-family: 'Share Tech Mono', 'Fira Mono', monospace;
  color: #39FF14;
  background: #101018;
  text-shadow: 0 0 8px #39FF14, 0 0 2px #39FF14;
  font-size: 1.2rem;
  letter-spacing: 0.05em;
  white-space: pre-wrap;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 24px #39FF1444;
}
```

## 5. Integration
- In your main panel, render the loader when `loading` is true:
  ```tsx
  {loading ? <MatrixMonologueLoader text={nextMonologue} loading={loading} /> : <ScenePanel ... />}
  ```
- Disable dialog buttons while loading.

## 6. Tips
- You can randomize the streaming speed for a more organic feel.
- For extra Matrix vibes, add random glyphs in empty space or animate background columns.

---

By following this guide, you'll deliver a unique, cyberpunk feedback experience to your players while the AI thinks!
