import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, signToken, verifyToken } from '../../../server/src/logic/auth';
import type { AuthPayload, UserRole } from '../../../server/src/types/index';

describe('hashPassword', () => {
    const password: string = 'Password123';

    it('should not return the plaintext password', async () => {
        const hash = await hashPassword(password);
        expect(hash).not.toBe(password);
    });
});
