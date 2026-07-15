import { canTransition, getAllowedTransitions } from '../../../server/src/logic/statusTransitions';
import { describe, it, expect } from 'vitest';

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

    // describe('invalid transitions', () => {

    // });
});