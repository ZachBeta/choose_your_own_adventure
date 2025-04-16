import { describe, it, expect } from 'vitest';
import { DialogService } from '../src/dialogService';

describe('DialogService', () => {
  it('returns a valid scene response when starting a scene', async () => {
    const dialogService = new DialogService({
      llm: { generate: async () => 'LLM says hello!' }
    });
    const req = { playerId: 'player1', sceneId: 'scene_intro' };
    const res = await dialogService.startScene(req);

    expect(res).toHaveProperty('monologue');
    expect(Array.isArray(res.thoughtCabinet)).toBe(true);
    expect(Array.isArray(res.dialog)).toBe(true);
    expect(res.llmLines).toContain('LLM says hello!');
  });
});
