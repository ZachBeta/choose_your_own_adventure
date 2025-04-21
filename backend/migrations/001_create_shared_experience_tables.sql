-- Migration: Create tables for shared experience API

CREATE TABLE IF NOT EXISTS shared_experiences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    channel_id TEXT NOT NULL,
    channel_name TEXT NOT NULL,
    thread_id TEXT,
    thread_name TEXT,
    scene TEXT NOT NULL,
    choices TEXT NOT NULL, -- JSON stringified array of choices
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(channel_id, thread_id)
);

CREATE TABLE IF NOT EXISTS shared_experience_participants (
    experience_id INTEGER,
    user_id TEXT,
    user_name TEXT,
    PRIMARY KEY (experience_id, user_id)
);

CREATE TABLE IF NOT EXISTS shared_experience_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    experience_id INTEGER,
    user_id TEXT,
    user_name TEXT,
    action TEXT,
    content TEXT,
    timestamp DATETIME
);
