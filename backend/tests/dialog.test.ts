import { describe, it, expect } from 'vitest';

// Minimal implementation for the dialog system
type Part = 'Joy' | 'Sadness' | 'Anger' | 'Fear' | 'Disgust';

interface DialogOption {
  id: string;
  text: string;
  skillCheck?: {
    part: Part;
    dc: number;
  };
}

interface Scene {
  monologue: string;
  thoughtCabinet: { part: Part; text: string }[];
  dialog: DialogOption[];
}

// Minimal function to get a scene (hardcoded for simplest test)
export function getScene(): Scene {
  return {
    monologue: 'You stand at the crossroads, emotions swirling inside.',
    thoughtCabinet: [
      { part: 'Joy', text: 'What a beautiful day for new friends!' },
      { part: 'Fear', text: 'What if they’re dangerous?' },
    ],
    dialog: [
      { id: 'opt1', text: 'Cheerfully greet the stranger.', skillCheck: { part: 'Joy', dc: 12 } },
      { id: 'opt2', text: 'Worry about their intentions.', skillCheck: { part: 'Fear', dc: 10 } },
      { id: 'opt3', text: 'Say nothing.' },
    ],
  };
}

describe('Dialog System', () => {
  it('displays the scene monologue, thought cabinet, and dialog options', () => {
    const scene = getScene();
    expect(scene.monologue).toBeDefined();
    expect(Array.isArray(scene.thoughtCabinet)).toBe(true);
    expect(scene.dialog.length).toBeGreaterThan(0);
    expect(scene.dialog[0].text).toContain('greet');
  });
});
