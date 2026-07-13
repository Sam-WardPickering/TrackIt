import { db } from './database.js';
import type { User, UserWithPassword, UserRole } from '../types/index.js';

/**
 * User data-access layer.
 *
 * SECURITY NOTE: Every query uses parameter binding (`?`), never string
 * concatenation. This is the correct defense against SQL injection and is what
 * the security test suite verifies by firing injection payloads at the auth
 * endpoints and asserting they are treated as literal data.
 */

export function createUser(
  email: string,
  name: string,
  passwordHash: string,
  role: UserRole = 'member'
): User {
  const stmt = db.prepare(
    `INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, ?)`
  );
  const info = stmt.run(email, name, passwordHash, role);
  return getUserById(info.lastInsertRowid as number)!;
}

export function getUserByEmail(email: string): UserWithPassword | undefined {
  return db
    .prepare(`SELECT * FROM users WHERE email = ?`)
    .get(email) as UserWithPassword | undefined;
}

export function getUserById(id: number): User | undefined {
  return db
    .prepare(`SELECT id, email, name, role, created_at FROM users WHERE id = ?`)
    .get(id) as User | undefined;
}

export function listUsers(): User[] {
  return db
    .prepare(`SELECT id, email, name, role, created_at FROM users ORDER BY id`)
    .all() as User[];
}
