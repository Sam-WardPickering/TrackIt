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

    it('accepts password of exactly 100 characters', () => {
        expect(registerSchema.safeParse({ ...validInput, password: 'A'.repeat(100) }).success).toBe(true);
    });

    it('rejects password over 100 characters', () => {
        expect(registerSchema.safeParse({ ...validInput, password: 'A'.repeat(101) }).success).toBe(false);
    });

    it('rejects name below one character', () => {
        expect(registerSchema.safeParse({ ...validInput, name: "" }).success).toBe(false);
    });

    it('accepts name of exactly one character', () => {
        expect(registerSchema.safeParse({ ...validInput, name: "a" }).success).toBe(true);
    });

    it('accepts name of exactly 80 characters', () => {
        expect(registerSchema.safeParse({ ...validInput, name: 'A'.repeat(80)}).success).toBe(true);
    });

    it('rejects a name over 80 characters', () => {
        expect(registerSchema.safeParse({ ...validInput, name: 'A'.repeat(81)}).success).toBe(false);
    });

    it('rejects an invalid email format', () => {
        expect(registerSchema.safeParse({ ...validInput, email: 'not-an-email' }).success).toBe(false);
    });
});

describe('loginSchema', () => {
    const validInput = {
        email: 'email@email.com',
        password: 'Password1234',
    };

    it('accepts a login with valid credentials (happy path)', () => {
        expect(loginSchema.safeParse(validInput).success).toBe(true);
    });

    it('rejects a login with invalid email', () => {
        expect(loginSchema.safeParse({ ...validInput, email: 'not-an-email' }).success).toBe(false);
    });
});