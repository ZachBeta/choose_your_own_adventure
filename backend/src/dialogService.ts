import { LLMClient } from './llmClient';

export class DialogService {
  llm: LLMClient;

  constructor({ llm }: { llm: LLMClient }) {
    this.llm = llm;
  }

  async startScene({ playerId, sceneId }: { playerId: string; sceneId: string }) {
    const prompt = `You are Joy and Fear from Inside Out. The player is starting scene "${sceneId}". Give a short, vivid monologue and two thought cabinet lines.`;
    const llmText = await this.llm.generate(prompt);

    // For demo, just return the LLM output as monologue and stub the rest
    return {
      monologue: llmText,
      thoughtCabinet: [
        { part: 'Joy', text: "Let's get started!" },
        { part: 'Fear', text: 'What if something goes wrong?' }
      ],
      dialog: [
        { id: 'opt1', text: 'Say hello.', skillCheck: { part: 'Joy', dc: 10 } },
        { id: 'opt2', text: 'Look around.' }
      ],
      llmLines: [llmText]
    };
  }
}
