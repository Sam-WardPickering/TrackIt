import { priorityWeight, sortByPriority } from '../../../server/src/logic/prioritySort';
import { describe, it, expect } from 'vitest';
import { Issue } from '../../../server/src/types';

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
    const issuesUnsorted: Issue[] = [];
});