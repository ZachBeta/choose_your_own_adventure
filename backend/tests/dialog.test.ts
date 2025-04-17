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

    expect(JSON.parse(res.llmLines[0])).toMatchSnapshot();
  }, 60000);

  it('handles a multi-turn happy path dialogue with memory', async () => {
    const dialogService = new DialogService({
      llm: new LLMClient()
    });
    const playerId = 'player_happy';
    // 1. Start the scene
    let res = await dialogService.startScene({ playerId, sceneId: 'scene_intro' });
    expect(JSON.parse(res.llmLines[0])).toMatchSnapshot('startScene');

    // 2. Choose a skill-check option
    const skillOption = res.dialog.find(o => o.skillCheck);
    expect(skillOption).toBeDefined();
    res = await dialogService.chooseOption({ playerId, optionId: skillOption!.id });
    expect(JSON.parse(res.llmLines[0])).toMatchSnapshot('chooseOption-skill');

    // 3. Choose a no-skill-check option, if present
    const noCheckOption = res.dialog.find(o => !o.skillCheck);
    if (noCheckOption) {
      res = await dialogService.chooseOption({ playerId, optionId: noCheckOption.id });
      expect(JSON.parse(res.llmLines[0])).toMatchSnapshot('chooseOption-no-skill');
    }

    // 4. Validate memory/history via getPlayerState
    if (typeof dialogService.getPlayerState === 'function') {
      const state = await dialogService.getPlayerState({ playerId });
      expect(state).toMatchSnapshot('playerState');
    }
  }, 60000);
});
