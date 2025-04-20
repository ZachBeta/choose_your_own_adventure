import { HistoryEntry } from '../../../../shared/types/experience';

export class HistoryEntryStorage {
  private history: HistoryEntry[] = [];
  
  async addEntry(entry: HistoryEntry): Promise<void> {
    this.history.push(entry);
  }
  
  async getRecentHistory(limit: number = 3): Promise<HistoryEntry[]> {
    return this.history.slice(-limit);
  }
  
  async getAllHistory(): Promise<HistoryEntry[]> {
    return [...this.history];
  }
} 