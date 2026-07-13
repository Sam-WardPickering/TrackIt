/**
 * Presentational badge for issue priority.
 *
 * TESTING SEAM (component/unit): pure, prop-driven, no side effects. A clean
 * React Testing Library target — assert it renders the right label and applies
 * the class/attribute for each priority value.
 */
type Priority = 'low' | 'medium' | 'high' | 'critical';

const LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      data-test={`priority-badge-${priority}`}
      className={`badge badge-priority badge-${priority}`}
    >
      {LABELS[priority]}
    </span>
  );
}
