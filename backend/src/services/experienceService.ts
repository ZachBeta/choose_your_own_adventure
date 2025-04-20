import { ExperienceNode } from '../../../shared/types/experience';
import { ExperiencePrompt } from '../experience/experiencePrompt';
import { ExperienceNodeStorage } from './storage/ExperienceNodeStorage';
import { HistoryEntryStorage } from './storage/HistoryEntryStorage';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
import { LLMClient } from '../llmClient';

export class ExperienceService {
  constructor(
    private nodeStorage: ExperienceNodeStorage,
    private historyStorage: HistoryEntryStorage,
    private experiencePrompt: ExperiencePrompt
  ) {}
  
  async generateNextExperience(selectedAction: string | null): Promise<ExperienceNode> {
    // Build prompt using both storage services
    const prompt = await this.experiencePrompt.buildPrompt(
      this.nodeStorage,
      this.historyStorage,
      selectedAction
    );
    
    try {
      // Generate new node using prompt...
      const newNode = await this.generateNode(prompt);
      
      // Store the new node
      await this.nodeStorage.store(newNode.id, newNode);
      
      if (selectedAction !== null) {
        await this.historyStorage.addEntry({
          node: newNode,
          selectedAction
        });
      }
      
      return newNode;
    } catch (error) {
      logger.error('Failed to generate next experience:', error);
      throw error;
    }
  }

  private async generateNode(choice: string): Promise<ExperienceNode> {
    // use experiencePrompt to generate a node
    const built_prompt = await this.experiencePrompt.buildPrompt(this.nodeStorage, this.historyStorage, choice);

    // TODO: Implement actual node generation using LLM
    const llm = new LLMClient();
    const node = await llm.generate(built_prompt);
    // This is a placeholder that should be replaced with actual implementation
    return ExperienceNodeParser.parse(node);
  }
} 

class ExperienceNodeParser {
  static parse(node: string): ExperienceNode {
    const parsed = JSON.parse(node);
    return {
      id: uuidv4(),
      scene: parsed.scene || "...",
      senses: parsed.senses || {
        visual: null,
        auditory: null,
        tactile: null,
        olfactory: null,
        taste: null
      },
      voices: parsed.voices || [],
      choices: parsed.choices || [{
        action: "...",
        difficulty: "...",
        dominantVoice: "..."
      }]
    };
  }
}