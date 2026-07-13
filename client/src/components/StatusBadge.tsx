/**
 * Presentational badge for issue status.
 * TESTING SEAM (component/unit): pure and prop-driven, like PriorityBadge.
 */
type Status = 'open' | 'in_progress' | 'resolved' | 'closed';

const LABELS: Record<Status, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span data-test={`status-badge-${status}`} className={`badge badge-status badge-${status}`}>
      {LABELS[status]}
    </span>
  );
}
