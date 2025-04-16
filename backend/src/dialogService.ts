import { LLMClient } from './llmClient';

export class DialogService {
  llm: LLMClient;

  constructor({ llm }: { llm: LLMClient }) {
    this.llm = llm;
  }

  async startScene({ playerId, sceneId }: { playerId: string; sceneId: string }) {
    const prompt = `You are an AI game master.\nGiven the following scene context, respond in strict JSON with these fields:\n- monologue: a short, vivid description of the scene\n- thoughtCabinet: an array of objects, each with 'part' (Joy, Fear, etc.) and 'text'\n- dialog: an array of dialog options, each with 'id', 'text', and optional 'skillCheck' (with 'part' and 'dc')\n\nScene context:\nPlayer has just entered scene \"${sceneId}\".\n\nRespond ONLY with valid JSON, no explanation or extra text. Example:\n{\n  \"monologue\": \"...\",\n  \"thoughtCabinet\": [\n    { \"part\": \"Joy\", \"text\": \"...\" }\n  ],\n  \"dialog\": [\n    { \"id\": \"opt1\", \"text\": \"...\", \"skillCheck\": { \"part\": \"Joy\", \"dc\": 10 } }\n  ]\n}`;
    const llmText = await this.llm.generate(prompt);
    let structured;
    try {
      console.log('LLM response:', llmText);
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
}
