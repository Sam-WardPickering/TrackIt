import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, signToken, verifyToken } from '../../../server/src/logic/auth';
import type { AuthPayload, UserRole } from '../../../server/src/types/index';

describe('hashPassword', () => {
    const password: string = 'Password123';

    it('should return a string', async () => {
        const hash = await hashPassword(password);
        expect(typeof hash).toBe('string');
    });

    it('should return a string of 60 characters', async () => {
        const hash = await hashPassword(password);
        expect(hash.length).toBeGreaterThanOrEqual(60);
    });

    it('should not return the plaintext password', async () => {
        const hash = await hashPassword(password);
        expect(hash).not.toBe(password);
    });
});

describe('verifyPassword', () => {
    const password: string = 'Password123!';

    it('should return true when hash and password match', async () => {
        const hash = await hashPassword(password);
        expect(await verifyPassword(password, hash)).toBe(true);
    });

    it('should return false when has and password do not match', async () => {
        const hash = await hashPassword(password);
        expect(await verifyPassword('Password123', hash)).toBe(false);
    });
});