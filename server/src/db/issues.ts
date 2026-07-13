import { db } from './database.js';
import type { Issue, IssueStatus, IssuePriority } from '../types/index.js';

/**
 * Issue data-access layer.
 *
 * SECURITY NOTE: The list() filter builder appends WHERE clauses dynamically but
 * still binds every value as a parameter — the column names are hard-coded and
 * only the *values* are user-supplied. This is the safe pattern for dynamic
 * filtering and is a deliberate, documented contrast to naive string building.
 */

export interface IssueFilters {
  status?: IssueStatus;
  priority?: IssuePriority;
  assignee_id?: number;
}

export function createIssue(input: {
  title: string;
  description: string;
  priority: IssuePriority;
  reporter_id: number;
  assignee_id: number | null;
}): Issue {
  const stmt = db.prepare(
    `INSERT INTO issues (title, description, priority, reporter_id, assignee_id)
     VALUES (?, ?, ?, ?, ?)`
  );
  const info = stmt.run(
    input.title,
    input.description,
    input.priority,
    input.reporter_id,
    input.assignee_id
  );
  return getIssueById(info.lastInsertRowid as number)!;
}

export function getIssueById(id: number): Issue | undefined {
  return db.prepare(`SELECT * FROM issues WHERE id = ?`).get(id) as Issue | undefined;
}

export function listIssues(filters: IssueFilters = {}): Issue[] {
  const clauses: string[] = [];
  const params: unknown[] = [];

  if (filters.status) {
    clauses.push('status = ?');
    params.push(filters.status);
  }
  if (filters.priority) {
    clauses.push('priority = ?');
    params.push(filters.priority);
  }
  if (filters.assignee_id !== undefined) {
    clauses.push('assignee_id = ?');
    params.push(filters.assignee_id);
  }

  const where = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
  return db
    .prepare(`SELECT * FROM issues ${where} ORDER BY updated_at DESC`)
    .all(...params) as Issue[];
}

export function updateIssue(
  id: number,
  fields: Partial<Pick<Issue, 'title' | 'description' | 'priority' | 'status' | 'assignee_id'>>
): Issue | undefined {
  const columns: string[] = [];
  const params: unknown[] = [];

  for (const [key, value] of Object.entries(fields)) {
    columns.push(`${key} = ?`);
    params.push(value);
  }

  if (columns.length === 0) return getIssueById(id);

  columns.push(`updated_at = datetime('now')`);
  params.push(id);

  db.prepare(`UPDATE issues SET ${columns.join(', ')} WHERE id = ?`).run(...params);
  return getIssueById(id);
}

export function deleteIssue(id: number): boolean {
  const info = db.prepare(`DELETE FROM issues WHERE id = ?`).run(id);
  return info.changes > 0;
}
