import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, '..', 'data.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    profile TEXT NOT NULL DEFAULT '{}',
    stage TEXT NOT NULL DEFAULT 'profile',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT UNIQUE NOT NULL,
    data TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
  );
`);

export function createSession(id, profile) {
  const stmt = db.prepare('INSERT INTO sessions (id, profile, stage) VALUES (?, ?, ?)');
  stmt.run(id, JSON.stringify(profile), 'profile');
}

export function getSession(id) {
  return db.prepare('SELECT * FROM sessions WHERE id = ?').get(id);
}

export function updateSession(id, fields) {
  const sets = [];
  const vals = [];
  for (const [k, v] of Object.entries(fields)) {
    sets.push(`${k} = ?`);
    vals.push(typeof v === 'object' ? JSON.stringify(v) : v);
  }
  vals.push(id);
  db.prepare(`UPDATE sessions SET ${sets.join(', ')}, updated_at = datetime('now') WHERE id = ?`).run(...vals);
}

export function addMessage(sessionId, role, content) {
  const stmt = db.prepare('INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)');
  return stmt.run(sessionId, role, content);
}

export function getMessages(sessionId) {
  return db.prepare('SELECT role, content FROM messages WHERE session_id = ? ORDER BY id ASC').all(sessionId);
}

export function saveRecommendations(sessionId, data) {
  db.prepare('INSERT OR REPLACE INTO recommendations (session_id, data) VALUES (?, ?)').run(sessionId, JSON.stringify(data));
}

export function getRecommendations(sessionId) {
  const row = db.prepare('SELECT data FROM recommendations WHERE session_id = ?').get(sessionId);
  return row ? JSON.parse(row.data) : null;
}

export default db;
