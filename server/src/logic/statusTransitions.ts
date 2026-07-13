import type { IssueStatus } from '../types/index.js';

/**
 * Issue status workflow rules.
 *
 * Not every status can move to every other status. This models a realistic
 * ticket lifecycle:
 *
 *   open ──► in_progress ──► resolved ──► closed
 *    ▲            │              │
 *    └────────────┴──────────────┘   (can reopen)
 *
 * - An issue can be reopened from resolved or closed back to open.
 * - A closed issue can only be reopened (not moved straight to in_progress).
 * - You cannot skip from open straight to resolved without work starting.
 *
 * TESTING SEAM (unit): This is pure, deterministic logic with clear valid/invalid
 * cases and boundary conditions — ideal for exhaustive table-driven unit tests.
 */
const ALLOWED_TRANSITIONS: Record<IssueStatus, IssueStatus[]> = {
  open: ['in_progress', 'closed'],
  in_progress: ['resolved', 'open', 'closed'],
  resolved: ['closed', 'open'],
  closed: ['open'],
};

export function canTransition(from: IssueStatus, to: IssueStatus): boolean {
  if (from === to) return false;
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function getAllowedTransitions(from: IssueStatus): IssueStatus[] {
  return ALLOWED_TRANSITIONS[from];
}
