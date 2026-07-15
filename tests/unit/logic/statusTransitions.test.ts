import { canTransition, getAllowedTransitions } from '../../../server/src/logic/statusTransitions';
import { describe, it, expect } from 'vitest';

describe('canTransition', () => {
    it('should allow open to in_progress', () => {
        expect(canTransition('open', 'in_progress')).toBe(true);
    });
});