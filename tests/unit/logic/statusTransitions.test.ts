import { canTransition, getAllowedTransitions } from '../../../server/src/logic/statusTransitions';
import { describe, it, expect } from 'vitest';

describe('canTransition', () => {

    describe('valid transitions', () => {

        it('should allow open to in_progress', () => {
            expect(canTransition('open', 'in_progress')).toBe(true);
        });

    });

    // describe('invalid transitions', () => {

    // });
});