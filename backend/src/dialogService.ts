import { LLMClient } from './llmClient';

export class DialogService {
  llm: LLMClient;
  private playerStates: Map<string, { history: any[] }>;

  constructor({ llm }: { llm: LLMClient }) {
    this.llm = llm;
    this.playerStates = new Map();
  }

  async startScene({ playerId, sceneId }: { playerId: string; sceneId: string }) {
    // initialize player state
    if (!this.playerStates.has(playerId)) {
      this.playerStates.set(playerId, { history: [] });
    }

    const prompt = `You are an AI game master.\nGiven the following scene context, respond in strict JSON with these fields:\n- monologue: a short, vivid description of the scene\n- thoughtCabinet: an array of objects, each with 'part' (Joy, Fear, etc.) and 'text'\n- dialog: an array of dialog options, each with 'id', 'text', and optional 'skillCheck' (with 'part' and 'dc')\n\nScene context:\nPlayer has just entered scene "${sceneId}".\n\nRespond ONLY with valid JSON, no explanation or extra text. Example:\n{\n  "monologue": "...",\n  "thoughtCabinet": [\n    { "part": "Joy", "text": "..." }\n  ],\n  "dialog": [\n    { "id": "opt1", "text": "...", "skillCheck": { "part": "Joy", "dc": 10 } }\n  ]\n}`;
    const llmText = await this.llm.generate(prompt);
    // extract raw JSON string from any code fences or extra text
    const jsonMatch = llmText.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : llmText;
    let structured;
    try {
      console.log('LLM response:', llmText);
      structured = JSON.parse(jsonString);
    } catch (e) {
      throw new Error('LLM did not return valid JSON');
    }
    return {
      monologue: structured.monologue,
      thoughtCabinet: structured.thoughtCabinet,
      dialog: structured.dialog,
      llmLines: [jsonString]
    };
  }

  async chooseOption({ playerId, optionId }: { playerId: string; optionId: string }) {
    // retrieve and update history
    const state = this.playerStates.get(playerId);
    if (!state) throw new Error(`Unknown player ${playerId}`);
    const prompt = `You are an AI game master. The player history: ${JSON.stringify(
      state.history
    )}. The player chose option "${optionId}". Respond in strict JSON with these fields:
- monologue: a short, vivid description
- thoughtCabinet: array of { part, text }
- dialog: array of options { id, text, optional skillCheck { part, dc } }
- skillCheckResult: optional object with roll, part, dc, outcome
Respond ONLY with valid JSON.`;
    const llmText = await this.llm.generate(prompt);
    const jsonMatch = llmText.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : llmText;
    let structured;
    try {
      structured = JSON.parse(jsonString);
    } catch (e) {
      throw new Error('LLM did not return valid JSON for chooseOption');
    }
    // update history
    state.history.push({ optionId, result: structured.skillCheckResult });
    return {
      monologue: structured.monologue,
      thoughtCabinet: structured.thoughtCabinet,
      dialog: structured.dialog,
      skillCheckResult: structured.skillCheckResult ?? undefined,
      llmLines: [jsonString]
    };
  }

  getPlayerState({ playerId }: { playerId: string }) {
    const state = this.playerStates.get(playerId);
    if (!state) throw new Error(`Unknown player ${playerId}`);
    return { history: state.history };
  }
}
