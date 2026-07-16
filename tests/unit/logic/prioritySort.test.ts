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

    const unsorted = [
        mockIssue({ id: 1, priority: 'low' }),
        mockIssue({ id: 2, priority: 'critical' }),
        mockIssue({ id: 3, priority: 'medium' }),
    ];

    it('should sort by priority', () => {
        const sorted = sortByPriority(unsorted);

        expect(sorted[0].id).toBe(2);  // critical first
        expect(sorted[1].id).toBe(3);  // medium second
        expect(sorted[2].id).toBe(1);  // low last
    });
});