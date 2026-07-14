/**
 * Client-side mirror of the server's status workflow.
 *
 * The server is the source of truth (it enforces transitions and returns 422 on
 * an illegal one). This mirror lets the UI only *offer* legal next-statuses in
 * the dropdown, so users don't routinely hit that error. The API test suite
 * should still verify the server rejects illegal transitions directly — the UI
 * guard is a convenience, not the enforcement point.
 */
export type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

const ALLOWED_TRANSITIONS: Record<IssueStatus, IssueStatus[]> = {
  open: ['in_progress', 'closed'],
  in_progress: ['resolved', 'open', 'closed'],
  resolved: ['closed', 'open'],
  closed: ['open'],
};

export function allowedNextStatuses(from: IssueStatus): IssueStatus[] {
  return ALLOWED_TRANSITIONS[from];
}

export const STATUS_LABELS: Record<IssueStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};
