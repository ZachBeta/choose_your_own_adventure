import { LLMClient } from './llmClient';

export class DialogService {
  llm: LLMClient;
  private scenePrompts: Record<string, string> = {
    scene_intro: 'cyberpunk noir style reminiscent of Disco Elysium',
    test_scene: 'controlled test scenario prompt'
  };
  private defaultPromptPrefix = 'cyberpunk noir style reminiscent of Disco Elysium';
  private playerStates: Map<string, { history: any[]; promptPrefix: string }>;

  constructor({ llm }: { llm: LLMClient }) {
    this.llm = llm;
    this.playerStates = new Map();
  }

  async startScene({ playerId, sceneId }: { playerId: string; sceneId: string }) {
    const prefix = this.scenePrompts[sceneId] || this.defaultPromptPrefix;
    if (!this.playerStates.has(playerId)) {
      this.playerStates.set(playerId, { history: [], promptPrefix: prefix });
    } else {
      this.playerStates.get(playerId)!.promptPrefix = prefix;
    }

    const prompt = `You are an AI game master with ${prefix}.\nGiven the following scene context, respond in strict JSON with these fields:\n- monologue: a short, vivid description of the scene\n- thoughtCabinet: an array of objects, each with 'part' (Joy, Fear, etc.) and 'text'\n- dialog: an array of dialog options, each with 'id', 'text', and optional 'skillCheck' (with 'part' and 'dc')\n\nScene context:\nPlayer has just entered scene "${sceneId}".\n\nRespond ONLY with valid JSON, no explanation or extra text. Example:\n{\n  "monologue": "...",\n  "thoughtCabinet": [\n    { "part": "Joy", "text": "..." }\n  ],\n  "dialog": [\n    { "id": "opt1", "text": "...", "skillCheck": { "part": "Joy", "dc": 10 } }\n  ]\n}`;
    const llmText = await this.llm.generate(prompt);
    let structured;
    try {
      // console.log('LLM response:', llmText);
      // Try to extract JSON block if LLM returns extra text
      const match = llmText.match(/\{[\s\S]*\}/);
      structured = JSON.parse(match ? match[0] : llmText);
    } catch (e) {
      throw new Error('LLM did not return valid JSON');
    }
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

    const prompt = `You are an AI game master with ${prefix}. The player history: ${JSON.stringify(
      state.history
    )}. The player chose option "${optionId}". Respond in strict JSON with these fields:`;
    // ... rest of the method remains the same ...
  }
}
