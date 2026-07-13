import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * SQLite connection.
 *
 * The DB path can be overridden with DATABASE_PATH — tests use an in-memory
 * database (':memory:') so each run is isolated and fast.
 *
 * TESTING SEAM: Injecting DATABASE_PATH=':memory:' gives the API test suite a
 * clean, throwaway database per process without touching the dev data file.
 */
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../trackit.db');

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initSchema(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS issues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','closed')),
      priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','critical')),
      reporter_id INTEGER NOT NULL,
      assignee_id INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);
}
