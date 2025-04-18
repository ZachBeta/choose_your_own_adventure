export interface PlayerHistoryEntry {
  scene: string;
  choice: string;
}

export class PlayerHistoryStore {
  private history: Map<string, PlayerHistoryEntry[]> = new Map();

  /**
   * Adds an entry to the player's history.
   */
  addEntry(playerId: string, scene: string, choice: string): void {
    if (!this.history.has(playerId)) {
      this.history.set(playerId, []);
    }
    this.history.get(playerId)!.push({ scene, choice });
  }

  /**
   * Returns the last N entries for the player, most recent last.
   */
  getRecentHistory(playerId: string, count: number): PlayerHistoryEntry[] {
    const entries = this.history.get(playerId) || [];
    return entries.slice(-count);
  }

  /**
   * Clears the player's history.
   */
  clearHistory(playerId: string): void {
    this.history.delete(playerId);
  }
}
