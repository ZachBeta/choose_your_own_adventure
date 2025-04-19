# Tutorial: Cyberpunk Styling & Visual Depth for Your CYOA Frontend

**Audience:** Midlevel Engineer

This guide shows how to give your React-based CYOA game a distinctive cyberpunk look with neon colors, visual depth, and clear UI separation.

---

## 1. Color Palette
- **Background:** #101018 (almost black)
- **Neon Accents:** #39FF14 (green), #FF00C8 (magenta), #00FFF7 (cyan), #FFD600 (yellow)
- **Text:** Use neon colors for headers, white or light gray for body

## 2. Fonts
- Use a cyberpunk or monospace font, e.g. 'Share Tech Mono', 'Orbitron', or 'VT323'
- Import from Google Fonts or serve locally

## 3. Box Layouts & Depth
- Wrap each section (logo, history, monologue, options) in a <div> with:
  - Neon border (e.g., `border: 2px solid #39FF14`)
  - Box-shadow for glow (`box-shadow: 0 0 24px #39FF1444`)
  - Semi-transparent dark background (`background: rgba(16,16,24,0.85)`)
  - Border-radius for rounded corners

## 4. Example CSS
```css
.cyber-box {
  border: 2px solid #39FF14;
  background: rgba(16,16,24,0.85);
  border-radius: 12px;
  box-shadow: 0 0 24px #39FF1444;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}
.cyber-header {
  color: #FF00C8;
  font-family: 'Orbitron', 'Share Tech Mono', monospace;
  font-size: 1.3rem;
  letter-spacing: 0.1em;
  text-shadow: 0 0 8px #FF00C8;
  margin-bottom: 1rem;
}
body {
  background: #101018;
  color: #E0E0E0;
  font-family: 'Share Tech Mono', monospace;
}
button {
  background: #101018;
  color: #39FF14;
  border: 2px solid #39FF14;
  border-radius: 8px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  box-shadow: 0 0 8px #39FF1444;
  transition: box-shadow 0.2s, border-color 0.2s;
}
button:hover, button:focus {
  border-color: #FF00C8;
  box-shadow: 0 0 16px #FF00C8;
  color: #FF00C8;
}
```

## 5. Integration
- Add the `cyber-box` class to each main UI section.
- Use `cyber-header` for section titles.
- Adjust colors for active/selected states for extra feedback.

## 6. Tips
- Use subtle animations (glow, flicker) for extra flair.
- Keep layout responsive for different devices.
- Test color contrast for accessibility.

---

With these steps, your CYOA game will feel right at home in a neon-lit cyberpunk world!
