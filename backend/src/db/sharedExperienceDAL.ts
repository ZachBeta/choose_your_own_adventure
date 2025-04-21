import Database from 'better-sqlite3';
import path from 'path';
import { SharedExperienceRequest, SharedExperienceResponse, SharedExperienceChoice, SharedExperienceHistoryEntry } from '../../../shared/types/sharedExperience';

const dbPath = path.join(__dirname, '../../shared_experience.db');
const db = new Database(dbPath);

export interface SharedExperienceRecord {
  id: number;
  channel_id: string;
  channel_name: string;
  thread_id?: string;
  thread_name?: string;
  scene: string;
  choices: SharedExperienceChoice[];
  created_at: string;
  updated_at: string;
}

export class SharedExperienceDAL {
  // Get or create experience for a channel/thread
  static getOrCreateExperience(req: SharedExperienceRequest, initialScene: string, initialChoices: SharedExperienceChoice[]): SharedExperienceRecord {
    let exp = db.prepare(
      `SELECT * FROM shared_experiences WHERE channel_id = ? AND (thread_id IS ? OR thread_id = ?)`
    ).get(req.channel_id, req.thread_id ?? null, req.thread_id ?? null);
    if (!exp) {
      const info = db.prepare(
        `INSERT INTO shared_experiences (channel_id, channel_name, thread_id, thread_name, scene, choices) VALUES (?, ?, ?, ?, ?, ?)`
      ).run(
        req.channel_id,
        req.channel_name,
        req.thread_id ?? null,
        req.thread_name ?? null,
        initialScene,
        JSON.stringify(initialChoices)
      );
      exp = db.prepare(`SELECT * FROM shared_experiences WHERE id = ?`).get(info.lastInsertRowid);
    }
    exp.choices = JSON.parse(exp.choices);
    return exp;
  }

  static updateSceneAndChoices(experience_id: number, scene: string, choices: SharedExperienceChoice[]): void {
    db.prepare(
      `UPDATE shared_experiences SET scene = ?, choices = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    ).run(scene, JSON.stringify(choices), experience_id);
  }

  static addParticipant(experience_id: number, user_id: string, user_name: string): void {
    db.prepare(
      `INSERT OR IGNORE INTO shared_experience_participants (experience_id, user_id, user_name) VALUES (?, ?, ?)`
    ).run(experience_id, user_id, user_name);
  }

  static getParticipants(experience_id: number): { user_id: string; user_name: string }[] {
    return db.prepare(
      `SELECT user_id, user_name FROM shared_experience_participants WHERE experience_id = ?`
    ).all(experience_id);
  }

  static addHistoryEntry(experience_id: number, user_id: string, user_name: string, action: string, content: string): void {
    db.prepare(
      `INSERT INTO shared_experience_history (experience_id, user_id, user_name, action, content, timestamp) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
    ).run(experience_id, user_id, user_name, action, content);
  }

  static getHistory(experience_id: number): SharedExperienceHistoryEntry[] {
    return db.prepare(
      `SELECT user_id, user_name, action, timestamp FROM shared_experience_history WHERE experience_id = ? ORDER BY timestamp ASC`
    ).all(experience_id);
  }
}
