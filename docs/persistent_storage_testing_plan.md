# Persistent Storage Refactor & Integration Testing Plan

## 1. Goal
Refactor the current in-memory storage classes (`ExperienceNodeStorage`, `HistoryEntryStorage`) to use persistent storage with raw SQL, and confirm correctness via integration tests.

---

## 2. Refactor Storage Classes for Persistence
- Replace in-memory Maps/arrays with SQL queries against a SQLite (or other SQL) database.
- Inject a database connection (e.g., `sqlite3`, `better-sqlite3`) into the storage classes.
- Implement CRUD operations using raw SQL, matching the schema in `backend/migrations/001_create_shared_experience_tables.sql`.

---

## 3. Integration Test Plan
- Use an in-memory SQLite database for tests (fast, isolated, no file cleanup needed).
- Run migrations at the start of the test suite to set up tables.
- Before each test, clear the tables to ensure test isolation.
- Use real types (`ExperienceNode`, `Voice`, `HistoryEntry`) from shared type definitions for test data.

### Test Cases
#### ExperienceNodeStorage
- Store a node and fetch by ID.
- Store multiple nodes and fetch by voice.

#### HistoryEntryStorage
- Add entries and fetch all.
- Add several entries and fetch the most recent N.

---

## 4. Example Refactor Outline
```typescript
import { Database } from 'sqlite3';
import { ExperienceNode } from '../../../../shared/types/experience';

export class ExperienceNodeStorage {
  constructor(private db: Database) {}
  async store(id: string, node: ExperienceNode): Promise<void> {
    const nodeJson = JSON.stringify(node);
    await new Promise((resolve, reject) =>
      this.db.run(
        `INSERT OR REPLACE INTO experience_nodes (id, data) VALUES (?, ?)`,
        [id, nodeJson],
        function (err) { if (err) reject(err); else resolve(undefined); }
      )
    );
  }
  async getById(id: string): Promise<ExperienceNode | null> {
    return new Promise((resolve, reject) =>
      this.db.get(
        `SELECT data FROM experience_nodes WHERE id = ?`,
        [id],
        (err, row) => { if (err) reject(err); else resolve(row ? JSON.parse(row.data) : null); }
      )
    );
  }
}
```

---

## 5. Example Integration Test Skeleton
```typescript
import sqlite3 from 'sqlite3';
import { ExperienceNodeStorage } from '../src/services/storage/ExperienceNodeStorage';
import { HistoryEntryStorage } from '../src/services/storage/HistoryEntryStorage';
import { ExperienceNode, HistoryEntry } from '../../shared/types/experience';

describe('Persistent Storage DALs', () => {
  let db: sqlite3.Database;
  let nodeStorage: ExperienceNodeStorage;
  let historyStorage: HistoryEntryStorage;

  beforeAll((done) => {
    db = new sqlite3.Database(':memory:', async () => {
      // Run migrations here (can use db.exec with the SQL from your migration file)
      await db.exec(`CREATE TABLE ...`); // etc.
      nodeStorage = new ExperienceNodeStorage(db);
      historyStorage = new HistoryEntryStorage(db);
      done();
    });
  });

  beforeEach((done) => {
    // Truncate tables
    db.exec('DELETE FROM experience_nodes; DELETE FROM history_entries;', done);
  });

  it('stores and retrieves an ExperienceNode', async () => {
    const node: ExperienceNode = { ... };
    await nodeStorage.store('node1', node);
    const fetched = await nodeStorage.getById('node1');
    expect(fetched).toEqual(node);
  });

  it('adds and retrieves HistoryEntry', async () => {
    const entry: HistoryEntry = { ... };
    await historyStorage.addEntry(entry);
    const all = await historyStorage.getAllHistory();
    expect(all).toContainEqual(entry);
  });
});
```

---

## 6. Next Steps
- Refactor both storage classes to use persistent storage.
- Implement and run the integration tests to confirm correct behavior.
- Optionally, expand tests to cover edge cases, updates, and deletions.
