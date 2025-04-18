import { describe, it, expect, beforeEach } from 'vitest';
import { PlayerHistoryStore } from '../playerHistoryStore';

describe('PlayerHistoryStore', () => {
  let store: PlayerHistoryStore;

  beforeEach(() => {
    store = new PlayerHistoryStore();
  });

  it('adds and retrieves entries', () => {
    store.addEntry('luigi', 'scene1', 'choice1');
    store.addEntry('luigi', 'scene2', 'choice2');
    expect(store.getRecentHistory('luigi', 2)).toEqual([
      { scene: 'scene1', choice: 'choice1' },
      { scene: 'scene2', choice: 'choice2' }
    ]);
  });

  it('returns only the last N entries', () => {
    store.addEntry('luigi', 'scene1', 'choice1');
    store.addEntry('luigi', 'scene2', 'choice2');
    store.addEntry('luigi', 'scene3', 'choice3');
    expect(store.getRecentHistory('luigi', 2)).toEqual([
      { scene: 'scene2', choice: 'choice2' },
      { scene: 'scene3', choice: 'choice3' }
    ]);
  });

  it('clears history', () => {
    store.addEntry('luigi', 'scene1', 'choice1');
    store.clearHistory('luigi');
    expect(store.getRecentHistory('luigi', 1)).toEqual([]);
  });

  it('separates histories by player', () => {
    store.addEntry('luigi', 'scene1', 'choice1');
    store.addEntry('mario', 'sceneX', 'choiceY');
    expect(store.getRecentHistory('luigi', 1)).toEqual([{ scene: 'scene1', choice: 'choice1' }]);
    expect(store.getRecentHistory('mario', 1)).toEqual([{ scene: 'sceneX', choice: 'choiceY' }]);
  });
});
