import { priorityWeight, sortByPriority } from '../../../server/src/logic/prioritySort';
import { describe, it, expect } from 'vitest';
import { Issue } from '../../../server/src/types';

const mockIssue = (overrides: Partial<Issue>): Issue => ({
  id: 1,
  title: 'test',
  description: '',
  status: 'open',
  priority: 'medium',
  reporter_id: 1,
  assignee_id: null,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  ...overrides,
});

describe('priorityWeight', () => {
    const criticalPriority: number = 4;
    const highPriority: number = 3;
    const mediumPriority: number = 2;
    const lowPriority: number = 1;

    it('should return critical priority weight', () => {
        expect(priorityWeight('critical')).toBe(criticalPriority);
    });

    it('should return high priority weight', () => {
        expect(priorityWeight('high')).toBe(highPriority);
    });

    it('should return medium priority weight', () => {
        expect(priorityWeight('medium')).toBe(mediumPriority);
    });

    it('should return low priority weight', () => {
        expect(priorityWeight('low')).toBe(lowPriority);
    });
});

describe('sortByPriority', () => {

    it('should sort by priority', () => {
        const unsorted = [
            mockIssue({ id: 1, priority: 'low' }),
            mockIssue({ id: 2, priority: 'critical' }),
            mockIssue({ id: 3, priority: 'medium' }),
        ];

        const sorted = sortByPriority(unsorted);
        expect(sorted[0].id).toBe(2);  // critical first
        expect(sorted[1].id).toBe(3);  // medium second
        expect(sorted[2].id).toBe(1);  // low last
    });

    it('should sort by updated timestamp when priorities are the same', () => {
        const tied = [
            mockIssue({ id: 1, priority: 'high', updated_at: '2024-01-01' }),
            mockIssue({ id: 2, priority: 'high', updated_at: '2024-06-01' }),
        ];

        const sorted = sortByPriority(tied);
        expect(sorted[0].id).toBe(2);   // more recent update comes first
        expect(sorted[1].id).toBe(1);
    });
});