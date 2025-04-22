import { SharedExperienceResponse } from '../../../shared/types/sharedExperience';
import { GroupState } from '../services/SharedExperienceService';

/**
 * Builds prompts for shared/group narrative experiences.
 */
export class SharedExperiencePrompt {
  /**
   * Create the full LLM prompt from group state.
   */
  buildPrompt(state: GroupState, history: { user_name: string; action: string }[]): string {
    const context = this.buildContext(state, history);
    const instructions = this.buildInstructions();
    const format = this.buildFormat();
    return `${context}\n\n${instructions}\n\n${format}`;
  }

  private buildContext(state: GroupState, history: { user_name: string; action: string }[]): string {
    if (!history || history.length === 0) {
      return `This is the start of a shared narrative for a group of ${state.participants.size} participants.`;
    }
    const recap = history
      .slice(-5)
      .map((h, i) => `${i + 1}. ${h.user_name} chose "${h.action}"`)
      .join('\n');
    return [`Current Scene: ${state.scene}`, `Recent Actions:`, recap].join('\n');
  }

  private buildInstructions(): string {
    return `Generate the next moment in this shared narrative.\n- Consider all participants’ perspectives.\n- Offer 2–4 group decisions with clear labels.\n- Keep tone consistent for a group adventure.`;
  }

  private buildFormat(): string {
    return `Respond with a JSON object exactly matching:@
{` +
      `\n  "scene": "string",` +
      `\n  "choices": [` +
      `\n    { "id": "string", "text": "string" }` +
      `\n  ]` +
      `\n}`;
  }
}
