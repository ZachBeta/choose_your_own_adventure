import { SharedExperienceHistoryEntry } from '../../../../shared/types/sharedExperience';

export class SharedHistoryEntryStorage {
  private history: SharedExperienceHistoryEntry[] = [];

  async addEntry(entry: SharedExperienceHistoryEntry): Promise<void> {
    this.history.push(entry);
  }

  async getRecentHistory(limit: number = 3): Promise<SharedExperienceHistoryEntry[]> {
    return this.history.slice(-limit);
  }

  async getAllHistory(): Promise<SharedExperienceHistoryEntry[]> {
    return [...this.history];
  }
}
