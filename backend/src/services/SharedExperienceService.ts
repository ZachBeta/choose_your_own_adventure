import { SharedExperienceRequest, SharedExperienceResponse } from '../../../shared/types/sharedExperience';
import { SharedExperiencePrompt } from '../experience/SharedExperiencePrompt';
import { ExperienceNodeStorage } from './storage/ExperienceNodeStorage';
import { HistoryEntryStorage } from './storage/HistoryEntryStorage';
import { LLMClient } from '../llmClient';
import { ExperienceNode } from '../../../shared/types/experience';
import { SharedExperienceParser } from '../experience/SharedExperienceParser';

// Group state representation
export interface GroupState {
  scene: string;
  choices: { id: string; text: string }[];
  participants: Set<string>;
  // history: SharedExperienceResponse['history']; // Now handled by storage
}

export class SharedExperienceService {
  private groupStates = new Map<string, GroupState>();
  private groupHistoryStorage = new Map<string, import('./storage/SharedHistoryEntryStorage').SharedHistoryEntryStorage>();

  constructor(
    private nodeStorage: ExperienceNodeStorage,
    private historyStorage: HistoryEntryStorage, // legacy, can be removed later
    private experiencePrompt: SharedExperiencePrompt
  ) {}

  private async handleLLMUpdate(state: GroupState, history: { user_name: string; action: string }[]): Promise<void> {
    const prompt = this.experiencePrompt.buildPrompt(state, history);
    const llm = new LLMClient();
    const fullResponse = await llm.generate(prompt);
    const newNode = SharedExperienceParser.parse(fullResponse);
    state.scene = newNode.scene;
    state.choices = newNode.choices; // preserve LLM's id and text
    // Optionally, store node if needed
  }

  async handleRequest(request: SharedExperienceRequest): Promise<SharedExperienceResponse> {
    const key = request.thread_id
      ? `${request.channel_id}:${request.thread_id}`
      : request.channel_id;

    let state = this.groupStates.get(key);
    if (!state) {
      state = {
        scene: `Welcome to the shared experience in ${request.channel_name}${
          request.thread_name ? ' / ' + request.thread_name : ''
        }!`,
        choices: [
          { id: 'choice_1', text: 'Explore the area' },
          { id: 'choice_2', text: 'Talk to the group' }
        ],
        participants: new Set(),
        // history: [] // Now handled by storage
      };
      this.groupStates.set(key, state);
    }

    // Ensure group history storage exists for this group
    if (!this.groupHistoryStorage.has(key)) {
      const { SharedHistoryEntryStorage } = require('./storage/SharedHistoryEntryStorage');
      this.groupHistoryStorage.set(key, new SharedHistoryEntryStorage());
    }
    const historyStorage = this.groupHistoryStorage.get(key)!;

    state.participants.add(request.user_id);
    if (request.action) {
      const entry = {
        user_id: request.user_id,
        user_name: request.user_name,
        action: request.action,
        timestamp: new Date().toISOString()
      };
      await historyStorage.addEntry(entry);
      const history = await historyStorage.getAllHistory();
      await this.handleLLMUpdate(state, history);
    }

    const history = await historyStorage.getAllHistory();
    return {
      scene: state.scene,
      choices: state.choices,
      participants: Array.from(state.participants),
      history
    };
  }
}
