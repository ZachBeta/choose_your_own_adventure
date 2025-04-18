import { LLMClient } from './llmClient';

export class DialogService {
  llm: LLMClient;
  debug: boolean;
  private scenePrompts: Record<string, string> = {
    scene_intro: 'cyberpunk noir style reminiscent of Disco Elysium',
    test_scene: 'controlled test scenario prompt'
  };
  private defaultPromptPrefix = 'cyberpunk noir style reminiscent of Disco Elysium';
  private playerStates: Map<string, { history: any[]; promptPrefix: string }>;

  constructor({ llm, debug = false }: { llm: LLMClient; debug?: boolean }) {
    this.llm = llm;
    this.debug = debug;
    this.playerStates = new Map();
  }

  async startScene({ playerId, sceneId }: { playerId: string; sceneId: string }) {
    const prefix = this.scenePrompts[sceneId] || this.defaultPromptPrefix;
    if (!this.playerStates.has(playerId)) {
      this.playerStates.set(playerId, { history: [], promptPrefix: prefix });
    } else {
      this.playerStates.get(playerId)!.promptPrefix = prefix;
    }

    const schemaString = require('./getSceneResponseJsonSchemaString').getSceneResponseJsonSchemaString();
    const prompt = `You are an AI game master with ${prefix}.
Given the following scene context, respond ONLY in valid JSON matching this schema:

${schemaString}

Scene context:
Player has just entered scene "${sceneId}".

Do not include any explanation or extra text. Only output valid JSON.`;
    if (this.debug) {
      console.log('>>> PROMPT:', prompt);
    }
    const llmText = await this.llm.generate(prompt);
    if (this.debug) {
      console.log('>>> LLM RESPONSE:', llmText);
    }
    const structured = require('./parseLlmJson').parseLlmSceneResponse(llmText);
    return {
      monologue: structured.monologue,
      thoughtCabinet: structured.thoughtCabinet,
      dialog: structured.dialog,
      llmLines: [llmText]
    };
  }

  async chooseOption({ playerId, optionId }: { playerId: string; optionId: string }) {
    const state = this.playerStates.get(playerId);
    if (!state) throw new Error(`Unknown player ${playerId}`);
    const prefix = state.promptPrefix;

    const schemaString = require('./getSceneResponseJsonSchemaString').getSceneResponseJsonSchemaString();
    const prompt = `You are an AI game master with ${prefix}. The player history: ${JSON.stringify(state.history)}. The player chose option "${optionId}". Respond ONLY in valid JSON matching this schema:\n\n${schemaString}\n\nDo not include any explanation or extra text. Only output valid JSON.`;
    if (this.debug) {
      console.log('>>> PROMPT:', prompt);
    }
    const llmText = await this.llm.generate(prompt);
    if (this.debug) {
      console.log('>>> LLM RESPONSE:', llmText);
    }
    const structured = require('./parseLlmJson').parseLlmSceneResponse(llmText);
    // update history
    state.history.push({ optionId, result: structured.skillCheckResult });
    return {
      monologue: structured.monologue,
      thoughtCabinet: structured.thoughtCabinet,
      dialog: structured.dialog,
      skillCheckResult: structured.skillCheckResult ?? undefined,
      llmLines: [llmText]
    };
  }

  getPlayerState({ playerId }: { playerId: string }) {
    const state = this.playerStates.get(playerId);
    if (!state) throw new Error(`Unknown player ${playerId}`);
    return { history: state.history };
  }
}
