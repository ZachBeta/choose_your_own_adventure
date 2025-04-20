import { ExperienceNode } from '../../../shared/types/experience';
import { ExperiencePrompt } from '../experience/experiencePrompt';
import { ExperienceNodeStorage } from './storage/ExperienceNodeStorage';
import { HistoryEntryStorage } from './storage/HistoryEntryStorage';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
import { LLMClient } from '../llmClient';
import { ExperienceNodeParser } from '../experience/experienceNodeParser';

export class ExperienceService {
  constructor(
    private nodeStorage: ExperienceNodeStorage,
    private historyStorage: HistoryEntryStorage,
    private experiencePrompt: ExperiencePrompt
  ) {}
  
  async generateNextExperience(
    selectedAction: string | null,
    streamHandler?: (chunk: string) => void
  ): Promise<ExperienceNode> {
    const prompt = await this.experiencePrompt.buildPrompt(
      this.nodeStorage,
      this.historyStorage,
      selectedAction
    );
    
    try {
      const newNode = await this.generateNode(prompt, streamHandler);
      
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

  private async generateNode(
    prompt: string,
    streamHandler?: (chunk: string) => void
  ): Promise<ExperienceNode> {
    const llm = new LLMClient();
    let fullResponse = '';

    if (streamHandler) {
      // Use streaming if handler provided
      for await (const chunk of llm.generateWithStream(prompt)) {
        fullResponse += chunk;
        streamHandler(chunk);
      }
    } else {
      // Fall back to non-streaming if no handler
      fullResponse = await llm.generate(prompt);
    }

    return {
      ...ExperienceNodeParser.parse(fullResponse)
    };
  }
}