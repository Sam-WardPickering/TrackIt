import { canTransition, getAllowedTransitions } from '../../../server/src/logic/statusTransitions';
import { describe, it, expect } from 'vitest';
import type { Issue, IssueStatus } from '../../../server/src/types/index';

describe('canTransition', () => {

    describe('valid transitions', () => {

        // Open
        it('should allow open to in_progress', () => {
            expect(canTransition('open', 'in_progress')).toBe(true);
        });

        it('should allow open to closed', () => {
            expect(canTransition('open', 'closed')).toBe(true);
        });

        // In-progress
        it('should allow in_progress to resolved', () => {
            expect(canTransition('in_progress', 'resolved')).toBe(true);
        });

        it('should allow in_progress to open', () => {
            expect(canTransition('in_progress', 'open')).toBe(true);
        });

        it('should allow in_progress to closed', () => {
            expect(canTransition('in_progress', 'closed')).toBe(true);
        });

        // Resolved
         it('should allow resolved to closed', () => {
            expect(canTransition('resolved', 'closed')).toBe(true);
        });

        it('should allow resolved to open', () => {
            expect(canTransition('resolved', 'open')).toBe(true);
        });

        // Closed
        it('should allow closed to open', () => {
            expect(canTransition('closed', 'open')).toBe(true);
        });

    });

    describe('invalid transitions', () => {

        it('should not allow open to resolved', () => {
            expect(canTransition('open', 'resolved')).toBe(false);
        });

        it('should not allow resolved to in_progress', () => {
            expect(canTransition('resolved', 'in_progress')).toBe(false);
        });

        it('should not allow closed to in_progress', () => {
            expect(canTransition('closed', 'in_progress')).toBe(false);
        });

        it('should not allow closed to resolved', () => {
            expect(canTransition('closed', 'resolved')).toBe(false);
        });
    });

    describe('same-status transitions', () => {

        it('should block open to open', () => {
            expect(canTransition('open', 'open')).toBe(false);
        });

        it('should block in_progress to in_progress', () => {
            expect(canTransition('in_progress', 'in_progress')).toBe(false);
        });

        it('should block resolved to resolved', () => {
            expect(canTransition('resolved', 'resolved')).toBe(false);
        });

        it('should block closed to closed', () => {
            expect(canTransition('closed', 'closed')).toBe(false);
        });
    });
});

describe('getAllowedTransitions', () => {
    const openTransitions: IssueStatus[] = ['in_progress', 'closed'];
    const inProgressTransitions: IssueStatus[] = ['resolved', 'open', 'closed'];
    const resolvedTransitions: IssueStatus[] = ['closed', 'open'];
    const closedTransitions: IssueStatus[] = ['open'];

});