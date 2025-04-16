export class DialogService {
  llm: { generate: () => Promise<string> };

  constructor({ llm }: { llm: { generate: () => Promise<string> } }) {
    this.llm = llm;
  }

  async startScene({ playerId, sceneId }: { playerId: string; sceneId: string }) {
    return {
      monologue: 'Welcome to the adventure!',
      thoughtCabinet: [
        { part: 'Joy', text: "Let's get started!" },
        { part: 'Fear', text: 'What if something goes wrong?' }
      ],
      dialog: [
        { id: 'opt1', text: 'Say hello.', skillCheck: { part: 'Joy', dc: 10 } },
        { id: 'opt2', text: 'Look around.' }
      ],
      llmLines: [await this.llm.generate()]
    };
  }
}
