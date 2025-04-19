import { LLMClient } from './llmClient';
import { PlayerHistoryStore } from './playerHistoryStore';
import { parseLlmSceneResponse } from './parseLlmJson';
import { getSceneResponseJsonSchemaString } from './getSceneResponseJsonSchemaString';
import { PromptBuilder } from './PromptBuilder';


import { logInfo, logError, logDebug } from './logger';

export class DialogService {
  llm: LLMClient;
  debug: boolean;
  private scenePrompts: Record<string, string> = {
    scene_intro: 'cyberpunk noir style reminiscent of Disco Elysium',
    test_scene: 'controlled test scenario prompt'
  };
  private defaultPromptPrefix = 'cyberpunk noir style reminiscent of Disco Elysium';
  private playerStates: Map<string, { promptPrefix: string }>;
  private playerHistoryStore: PlayerHistoryStore = new PlayerHistoryStore();
  private promptBuilder: PromptBuilder = new PromptBuilder();

  constructor({ llm, debug = false }: { llm: LLMClient; debug?: boolean }) {
    this.llm = llm;
    this.debug = debug;
    this.playerStates = new Map();
    this.playerHistoryStore = new PlayerHistoryStore();
    logDebug(`Initialized DialogService with llm: ${llm} and debug: ${debug}`);
  }

  async startScene({ playerId, sceneId }: { playerId: string; sceneId?: string }) {
    const chosenSceneId = sceneId || 'scene_intro';
    const prefix = this.scenePrompts[chosenSceneId] || this.defaultPromptPrefix;
    if (!this.playerStates.has(playerId)) {
      this.playerStates.set(playerId, { promptPrefix: prefix });
    } else {
      this.playerStates.get(playerId)!.promptPrefix = prefix;
    }
    // Clear history for new scene
    this.playerHistoryStore.clearHistory(playerId);

    const schemaString = getSceneResponseJsonSchemaString();
    const prompt = `You are an AI game master with ${prefix}.
Given the following scene context, respond ONLY in valid JSON matching this schema:

${schemaString}

Scene context:
Player has just entered scene "${sceneId}".

Do not include any explanation or extra text. Only output valid JSON.`;
    logInfo(`Generated prompt for player ${playerId} and scene ${sceneId}:`, prompt);
    const llmText = await this.llm.generate(prompt);
    logInfo(`Received LLM response for player ${playerId} and scene ${sceneId}:`, llmText);
    const structured = parseLlmSceneResponse(llmText);
    return {
      monologue: structured.monologue,
      thoughtCabinet: structured.thoughtCabinet,
      dialog: structured.dialog,
      llmLines: [llmText]
    };
  }

  async chooseOption({ playerId, optionId }: { playerId: string; optionId: string }) {
    const state = this.playerStates.get(playerId);
    if (!state) {
      logError(`Unknown player ${playerId}`);
      throw new Error(`Unknown player ${playerId}`);
    }
    const prefix = state.promptPrefix;

    const ctx = {
      prefix,
      history: this.playerHistoryStore.getRecentHistory(playerId, 3),
      currentChoice: optionId,
      schemaString: getSceneResponseJsonSchemaString()
    };
    const prompt = this.promptBuilder.buildPrompt(ctx);
    logInfo(`Generated prompt for player ${playerId} and option ${optionId}:`, prompt);
    const llmText = await this.llm.generate(prompt);
    logInfo(`Received LLM response for player ${playerId} and option ${optionId}:`, llmText);
    const structured = parseLlmSceneResponse(llmText);
    // update server-side history
    // Attempt to get scene name from structured or state if available, fallback to empty string
    const scene = structured.monologue || '';
    this.playerHistoryStore.addEntry(playerId, scene, optionId);
    return {
      monologue: structured.monologue,
      thoughtCabinet: structured.thoughtCabinet,
      dialog: structured.dialog,
      skillCheckResult: structured.skillCheckResult ?? undefined,
      llmLines: [llmText]
    };
  }

  getPlayerState({ playerId }: { playerId: string }) {
    // Return history from PlayerHistoryStore
    const history = this.playerHistoryStore.getRecentHistory(playerId, 10);
    return { history };

  }
}
