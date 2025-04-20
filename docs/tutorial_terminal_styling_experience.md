# Tutorial: Terminal-Style UI Implementation for Experience Page

**Audience:** Midlevel Engineer  
**Goal:** Learn to implement a consistent terminal-style UI for the experience page using our existing component library and styling guidelines.

---

## 1. Component Integration

### Terminal Components
Import the core components:
```typescript
import { TerminalPanel, TerminalButton, TerminalCodeBlock } from './UI';
import { COLOR_PALETTE } from './colorPalette';
```

### Scene Section
```typescript
<TerminalPanel>
  <h2 style={{ color: COLOR_PALETTE.accent }}>Current Scene</h2>
  <p style={{ color: COLOR_PALETTE.foreground }}>{currentNode.scene}</p>
</TerminalPanel>
```

### Sensory Details
```typescript
<TerminalPanel>
  <h3 style={{ color: COLOR_PALETTE.highlight }}>Sensory Details</h3>
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
    {Object.entries(currentNode.senses).map(([sense, detail]) => (
      detail && (
        <TerminalCodeBlock key={sense}>
          <h4 style={{ color: COLOR_PALETTE.accent }}>{sense}</h4>
          <p>{detail}</p>
        </TerminalCodeBlock>
      )
    ))}
  </div>
</TerminalPanel>
```

## 2. Color System

Use the established terminal color palette:
```typescript
const COLOR_PALETTE = {
  background: "#181818",   // Terminal Black
  foreground: "#00FF00",   // Terminal Green
  highlight:  "#39FF14",   // Bright Green
  accent:     "#FFBF00",   // Amber
  blue:       "#00FFFF",   // Cyan
  red:        "#FF5555",   // Red
  yellow:     "#FFFF55",   // Yellow
  magenta:    "#FF55FF",   // Magenta
  white:      "#F8F8F2",   // White
  lowlight:   "#44475A",   // Terminal Gray
};
```

### Color Usage Guide
- `accent`: Main headings
- `highlight`: Section headers
- `yellow`: Emphasis text
- `blue`: Secondary information
- `foreground`: Body text
- `lowlight`: Panel backgrounds

## 3. Terminal Font Stack

### Global CSS Variables
```css
:root {
  --font-terminal: "Fira Mono", "Consolas", "Monaco", monospace;
}
```

### Base Styles
```css
body {
  font-family: var(--font-terminal);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

input, button, textarea, select {
  font-family: var(--font-terminal);
}
```

## 4. Animations & Transitions

### Text Reveal
```css
@keyframes typewriter {
  from { 
    opacity: 0;
    transform: translateY(8px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Panel Transitions
```css
.terminal-panel {
  transition: opacity 0.3s, transform 0.3s;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### Terminal Glow Effect
```css
@keyframes terminalGlow {
  0% { text-shadow: 0 0 5px currentColor; }
  50% { text-shadow: 0 0 10px currentColor; }
  100% { text-shadow: 0 0 5px currentColor; }
}
```

## 5. Implementation Steps

1. **Update Global Styles**
   - Add font stack CSS variables
   - Include animation keyframes
   - Set base terminal styles

2. **Replace Current Components**
   - Scene → TerminalPanel
   - Sensory details → nested TerminalCodeBlocks
   - Voice dialogues → TerminalCodeBlock
   - Choices → TerminalButton

3. **Apply Color System**
   - Update all color references to use COLOR_PALETTE
   - Ensure consistent usage across components

4. **Add Animations**
   - Text reveal effects for new content
   - Panel transitions for section changes
   - Button hover effects
   - Voice dialog animations

## 6. Accessibility Considerations

- Ensure sufficient color contrast
- Add `prefers-reduced-motion` media query
- Maintain keyboard navigation
- Keep animation durations short (0.2s - 0.5s)

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 7. Testing

- Test across different browsers
- Verify font fallbacks
- Check animation performance
- Validate color contrast ratios
- Test with screen readers

---

This implementation provides a consistent, terminal-style UI that matches our styleguide while maintaining accessibility and performance. The components are reusable and the styling system is maintainable through our established color palette and font stack. 