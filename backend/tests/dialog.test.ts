import { describe, it, expect } from 'vitest';
import { DialogService } from '../src/dialogService';

describe('DialogService', () => {
  it('returns a valid scene response when starting a scene', async () => {
    const { LLMClient } = await import('../src/llmClient');
    const dialogService = new DialogService({
      llm: new LLMClient()
    });
    const req = { playerId: 'player1', sceneId: 'scene_intro' };
    const res = await dialogService.startScene(req);

    expect(typeof res.monologue).toBe('string');
    expect(Array.isArray(res.thoughtCabinet)).toBe(true);
    expect(Array.isArray(res.dialog)).toBe(true);
    expect(Array.isArray(res.llmLines)).toBe(true);
    // Optionally, check structure of one dialog option
    expect(res.dialog[0]).toHaveProperty('id');
    expect(res.dialog[0]).toHaveProperty('text');
  }, 60000);
});
