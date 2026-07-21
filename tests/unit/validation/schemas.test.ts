import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema, createIssueSchema, updateIssueSchema } from '../../../server/src/validation/schemas';

describe('registerSchema', () => {
    const validInput = {
        email: 'test@email.com',
        password: 'Password12345',
        name: 'sam',
    };

    it('accepts a valid input (happy path)', () => {
        expect(registerSchema.safeParse(validInput).success).toBe(true);
    });

    it('rejects password under 8 characters', () => {
        expect(registerSchema.safeParse({ ...validInput, password: 'Pword12'}).success).toBe(false);
    });

    it('accepts password of exactly 8 characters', () => {
        expect(registerSchema.safeParse({ ...validInput, password: 'password'}).success).toBe(true);
    });

    it('rejects password of exactly 100 characters', () => {
        expect(registerSchema.safeParse({ ...validInput, password: 'A'.repeat(100) }).success).toBe(true);
    });
});