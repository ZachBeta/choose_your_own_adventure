import { ExperienceNode, Voice } from '../../../../shared/types/experience';

export class ExperienceNodeStorage {
  private nodes: Map<string, ExperienceNode> = new Map();
  
  async store(id: string, node: ExperienceNode): Promise<void> {
    this.nodes.set(id, node);
  }
  
  async getById(id: string): Promise<ExperienceNode | null> {
    return this.nodes.get(id) || null;
  }
  
  async getNodesWithVoice(voiceName: string): Promise<ExperienceNode[]> {
    return Array.from(this.nodes.values())
      .filter(node => node.voices.some((v: Voice) => v.part === voiceName));
  }

  async getVoiceHistory(voiceName: string): Promise<Voice[]> {
    return Array.from(this.nodes.values())
      .flatMap(node => node.voices.filter((v: Voice) => v.part === voiceName));
  }
} 