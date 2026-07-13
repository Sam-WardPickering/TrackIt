import type { Issue, IssuePriority } from '../types/index.js';

/**
 * Priority ordering for issue lists.
 *
 * Weights let us sort a mixed list so the most urgent work surfaces first.
 * Higher weight = more urgent.
 *
 * TESTING SEAM (unit): Deterministic ordering with a documented tie-breaker.
 * Good candidate for property-style tests (sorted output is a permutation of
 * input; never loses or duplicates items) plus explicit tie-break cases.
 */
const PRIORITY_WEIGHT: Record<IssuePriority, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export function priorityWeight(priority: IssuePriority): number {
  return PRIORITY_WEIGHT[priority];
}

/**
 * Sorts issues by priority (most urgent first). Ties are broken by most
 * recently updated first. Returns a NEW array (does not mutate input).
 */
export function sortByPriority(issues: Issue[]): Issue[] {
  return [...issues].sort((a, b) => {
    const weightDiff = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
    if (weightDiff !== 0) return weightDiff;
    // Tie-break: most recently updated first
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });
}
