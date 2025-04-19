# Integration Plan: UI Style Guides into Main Gameplay Loop

## 1. **Define UI Roles in Gameplay**
- **Conscious Mind (Terminal Theme):**
  - Used for explicit player choices, main narration, command input, and logical UI blocks.
  - Represents clarity, logic, and direct interaction.
- **Subconscious Mind (Night Sky Theme):**
  - Used for dream sequences, intuition-based choices, hints, background thoughts, or transitions.
  - Represents intuition, emotion, mystery, and immersion.

---

## 2. **Component Integration Steps**

### a. **Centralize Palettes and Components**
- Export both palettes (`colorPalette.ts`, `subconsciousPalette.ts`) from a shared `theme/` directory.
- Ensure all UI components (Button, Panel, Input, etc.) are importable from a unified `UI/` directory.

### b. **Gameplay Loop UI Mapping**
- **Main game screen:**  
  - Use TerminalPanel, TerminalButton, TerminalInput for primary gameplay actions and text.
- **Subconscious events:**  
  - When a dream, intuition, or subconscious event triggers, overlay or transition to SubconsciousPanel, SubconsciousButton, etc.
  - Animate transitions between the two themes for immersion (e.g., fade to night sky, floaty panel appears).

### c. **State Management**
- Use a global state (e.g., React context or Redux) to control which “mind” is active.
- Conditionally render UI blocks based on the current state (conscious/subconscious).

### d. **Reusable Blocks**
- Refactor key UI blocks (dialogs, choices, notifications) to accept a `theme` prop, switching styles as needed.

---

## 3. **Sample Integration Pseudocode**

```tsx
import { TerminalPanel, TerminalButton } from './UI/Button';
import { SubconsciousPanel, SubconsciousButton } from './UI/SubconsciousPanel';

function GameUI({ mode }) {
  if (mode === 'conscious') {
    return (
      <TerminalPanel>
        {/* Main gameplay, choices, inputs */}
        <TerminalButton>Choose Path</TerminalButton>
      </TerminalPanel>
    );
  } else if (mode === 'subconscious') {
    return (
      <SubconsciousPanel>
        {/* Dream sequence, intuition, etc. */}
        <SubconsciousButton>Follow the Dream</SubconsciousButton>
      </SubconsciousPanel>
    );
  }
}
```

---

## 4. **Next Steps**
- Refactor main gameplay components to use the new UI blocks.
- Implement a state toggle or event system to switch between conscious/subconscious modes.
- Optionally, add animated transitions between themes for polish.
- Document usage and best practices for future contributors.

---

**This plan will allow you to create a visually and thematically rich gameplay experience, with clear cues for players when they are in the “conscious” or “subconscious” parts of the story.**
