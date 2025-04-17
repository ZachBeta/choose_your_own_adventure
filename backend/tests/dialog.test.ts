import { describe, it, expect } from 'vitest';
import { DialogService } from '../src/dialogService';
import { LLMClient } from '../src/llmClient';

describe('DialogService', () => {
  it('returns a valid scene response when starting a scene', async () => {
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

  it('handles a multi-turn happy path dialogue with memory', async () => {
    const dialogService = new DialogService({
      llm: new LLMClient()
    });
    const playerId = 'player_happy';
    // 1. Start the scene
    let res = await dialogService.startScene({ playerId, sceneId: 'scene_intro' });
    expect(res.dialog.length).toBeGreaterThan(0);
    expect(typeof res.monologue).toBe('string');
    expect(Array.isArray(res.thoughtCabinet)).toBe(true);
    expect(Array.isArray(res.llmLines)).toBe(true);

    // 2. Choose a skill-check option
    const skillOption = res.dialog.find(o => o.skillCheck);
    expect(skillOption).toBeDefined();
    res = await dialogService.chooseOption({ playerId, optionId: skillOption!.id });
    expect(res.skillCheckResult).toBeDefined();
    expect(typeof res.monologue).toBe('string');

    // 3. Choose a no-skill-check option, if present
    const noCheckOption = res.dialog.find(o => !o.skillCheck);
    if (noCheckOption) {
      res = await dialogService.chooseOption({ playerId, optionId: noCheckOption.id });
      expect(res.skillCheckResult).toBeUndefined();
      expect(typeof res.monologue).toBe('string');
    }

    // 4. Validate memory/history via getPlayerState
    if (typeof dialogService.getPlayerState === 'function') {
      const state = await dialogService.getPlayerState({ playerId });
      expect(state.history.length).toBeGreaterThanOrEqual(1);
      expect(typeof state.history[0]).toBe('object');
    }
  }, 60000);
});
