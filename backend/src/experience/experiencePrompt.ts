import { HistoryEntry } from '../../../shared/types/experience';
import { ExperienceNodeStorage } from '../services/storage/ExperienceNodeStorage';
import { HistoryEntryStorage } from '../services/storage/HistoryEntryStorage';
import { logger } from '../utils/logger';

export class ExperiencePrompt {
  async buildPrompt(
    nodeStorage: ExperienceNodeStorage,
    historyStorage: HistoryEntryStorage,
    choice: string | null 
  ): Promise<string> {
    const history = await historyStorage.getRecentHistory();
    const contextPrompt = await this.buildContextPrompt(nodeStorage, history, choice)
    const instructionsPrompt = this.buildInstructionsPrompt();
    const formatPrompt = this.buildFormatPrompt();

    return `${contextPrompt}\n\n${instructionsPrompt}\n\n${formatPrompt}`;
  }

  private async buildContextPrompt(
    nodeStorage: ExperienceNodeStorage,
    history: HistoryEntry[],
    choice: string | null
  ): Promise<string> {
    if (history.length === 0) {
      return `You are generating the opening scene of an interactive narrative experience.
The player is waking up to consciousness, and their internal voices are beginning to emerge.`;
    }

    const recentHistory = history.slice(-3); // Show last 3 nodes for context
    const lastEntry = history[history.length - 1];

    let contextPrompt = `Recent narrative history:`;
    
    recentHistory.forEach((entry, index) => {
      contextPrompt += `\n${index + 1}. Scene: "${entry.node.scene}"`;
      contextPrompt += `\n   Player chose: "${entry.selectedAction}"`;
    });

    // Add voice history context
    const activeVoices = lastEntry.node.voices;
    for (const voice of activeVoices) {
      const voiceHistory = await nodeStorage.getVoiceHistory(voice.part);
      if (voiceHistory.length > 0) {
        contextPrompt += `\n\nVoice "${voice.part}" history:`;
        contextPrompt += `\n- Current strength: ${voice.strength}`;
        contextPrompt += `\n- Previous appearances: ${voiceHistory.length}`;
        // Could add more voice history analysis here if needed
      }
    }

    contextPrompt += `\n\nActive voices from last scene: ${activeVoices
      .map(v => `${v.part} (${v.strength})`)
      .join(', ')}`;

    if (choice) {
      contextPrompt += `\n\nThe player chose: "${choice}"`;
    }

    return contextPrompt;
  }

  private buildInstructionsPrompt(): string {
    return `Generate the next moment in this interactive narrative.

Key requirements:
1. Scene description should be vivid and atmospheric
2. Include sensory details (what they see, hear, feel, smell, taste - any can be null if not relevant)
3. Internal voices should:
   - Have distinct personalities
   - Express varying strengths (e.g., "Whisper", "Clear", "Urgent", "Overwhelming")
   - React to the current situation
4. Provide 2-4 meaningful choices, each with:
   - Clear action description
   - Difficulty level (Safe, Easy, Risky, Dangerous)
   - A dominant voice that advocates for this choice`;
  }

  private buildFormatPrompt(): string {
    return `Respond with a single JSON object matching exactly this structure:
{
  "scene": "string",
  "senses": {
    "visual": "string or null",
    "auditory": "string or null",
    "tactile": "string or null",
    "olfactory": "string or null",
    "taste": "string or null"
  },
  "voices": [
    {
      "part": "string",
      "strength": "string",
      "dialogue": "string"
    }
  ],
  "choices": [
    {
      "action": "string",
      "difficulty": "string",
      "dominantVoice": "string"
    }
  ]
}`;
  }
} 