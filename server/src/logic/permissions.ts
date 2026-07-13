import type { Issue, User } from '../types/index.js';

/**
 * Authorization rules for issue mutations.
 *
 * Rules:
 * - Admins can edit or delete ANY issue.
 * - A member can edit an issue if they are the reporter OR the assignee.
 * - Only the reporter or an admin can DELETE an issue (assignees cannot delete).
 *
 * TESTING SEAM (unit + security): These predicates encode the app's access-control
 * model. Unit tests should cover every role/ownership combination. Security tests
 * (API level) should verify the HTTP layer actually enforces these and can't be
 * bypassed by, e.g., editing another user's issue via a crafted request.
 */
export function canEditIssue(user: Pick<User, 'id' | 'role'>, issue: Issue): boolean {
  if (user.role === 'admin') return true;
  return issue.reporter_id === user.id || issue.assignee_id === user.id;
}

export function canDeleteIssue(user: Pick<User, 'id' | 'role'>, issue: Issue): boolean {
  if (user.role === 'admin') return true;
  return issue.reporter_id === user.id;
}
