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
    return `Generate the next moment in this shared narrative as if you are narrating a campy, cliché-ridden, maximalist cyberpunk adventure. Embrace every trope: neon, rain, trenchcoats, existential dread, melodrama, and self-aware humor. Be unafraid to wink at the player and exaggerate the style.

Instructions:
- Scene: Describe what the group perceives using every cyberpunk and noir cliché you can muster—neon, rain, trenchcoats, existential dread, etc. Be melodramatic, self-aware, and unafraid to break the fourth wall.
- Thoughts: Add a brief, flavor-rich inner monologue or philosophical aside.
- Choices: Present 2–4 options, each with attitude, camp, or a nod to genre tropes.
- Keep the entire response under 500 characters.

Example output:
{
  "scene": "Rain pelts your trenchcoats, neon bleeding down the alley like a synthwave fever dream. Somewhere, a saxophone wails—of course it does. You wonder, not for the first time, if hope is just another brand of cigarette in this city.",
  "choices": [
    { "id": "1", "text": "Adjust your trenchcoat and light a cigarette." },
    { "id": "2", "text": "Glare at the shadowy figure in the doorway." },
    { "id": "3", "text": "Monologue about the futility of hope." }
  ]
}`;
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
