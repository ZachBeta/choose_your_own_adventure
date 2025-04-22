import { SharedExperienceRequest, SharedExperienceResponse } from '../../../shared/types/sharedExperience';
import { ExperiencePrompt } from '../experience/experiencePrompt';
import { ExperienceNodeStorage } from './storage/ExperienceNodeStorage';
import { HistoryEntryStorage } from './storage/HistoryEntryStorage';
import { LLMClient } from '../llmClient';
import { ExperienceNodeParser } from '../experience/experienceNodeParser';

// Internal group state representation
interface GroupState {
  scene: string;
  choices: { id: string; text: string }[];
  participants: Set<string>;
  history: SharedExperienceResponse['history'];
}

export class SharedExperienceService {
  private groupStates = new Map<string, GroupState>();
  constructor(
    private nodeStorage: ExperienceNodeStorage,
    private historyStorage: HistoryEntryStorage,
    private experiencePrompt: ExperiencePrompt
  ) {}

  /**
   * Handles a shared experience request for a group (channel/thread).
   */
  async handleRequest(request: SharedExperienceRequest): Promise<SharedExperienceResponse> {
    // Determine group key (channel or channel:thread)
    const key = request.thread_id
      ? `${request.channel_id}:${request.thread_id}`
      : request.channel_id;
    // Initialize state if missing
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
        history: []
      };
      this.groupStates.set(key, state);
    }
    // Ensure participant is tracked
    state.participants.add(request.user_id);
    // Record action if provided
    if (request.action) {
      const entry = {
        user_id: request.user_id,
        user_name: request.user_name,
        action: request.action,
        timestamp: new Date().toISOString()
      };
      state.history.push(entry);
      // Update scene for now to reflect last action
      state.scene = `Last action by ${request.user_name}: ${request.action}`;
    }
    // Build response from state
    return {
      scene: state.scene,
      choices: state.choices,
      participants: Array.from(state.participants),
      history: state.history
    };
  }
}
