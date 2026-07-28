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

    it('rejects a login with password below one character', () => {
        expect(loginSchema.safeParse({ ...validInput, password: ''}).success).toBe(false);
    });
});

describe('createIssueSchema', () => {
    const validInput = {
        title: 'Title',
        description: 'Test Description',
        priority: 'low',
        assignee_id: 123456,
    };

    it('creates a issue with valid input (happy path)', () => {
        expect(createIssueSchema.safeParse(validInput).success).toBe(true);
    });

    describe('title field validation', () => {
        it('rejects a issue with title length below minimum', () => {
            expect(createIssueSchema.safeParse({ ...validInput, title: 'qw' }).success).toBe(false);
        });

        it('accepts a issue with title length at min boundary', () => {
            expect(createIssueSchema.safeParse({ ...validInput, title: 'qwe' }).success).toBe(true);
        });

        it('accepts a issue with title length at upper boundary', () => {
            expect(createIssueSchema.safeParse({ ...validInput, title: 'A'.repeat(120) }).success).toBe(true);
        });

        it('rejects a issue with title length above upper boundary', () => {
            expect(createIssueSchema.safeParse({ ...validInput, title: 'A'.repeat(121) }).success).toBe(false);
        });
    });

    describe('description field validation', () => {
        it('accepts a issue with description length at upper boundary', () => {
            expect(createIssueSchema.safeParse({ ...validInput, description: 'A'.repeat(5000) }).success).toBe(true);
        });

        it('rejects a issue with description length over upper boundary', () => {
            expect(createIssueSchema.safeParse({ ...validInput, description: 'A'.repeat(5001) }).success).toBe(false);
        });
    });

    describe('priority field validation', () => {
        it('defaults to medium priority when field is ommitted', () => {
            const { priority, ...inputWithoutPriority } = validInput;
            const result = createIssueSchema.safeParse(inputWithoutPriority);

            expect(result.success).toBe(true);

            if (result.success) {
                expect(result.data.priority).toBe('medium');
            }
        });

        it('rejects a issue with an invalid priority value', () => {
            expect(createIssueSchema.safeParse({ ...validInput, priority: 'notapriority' }).success).toBe(false);
        });
    });

    describe('assignee_id field validation', () => {
        it('accepts an issue with omitted assignee_id', () => {
            const { assignee_id, ...inputWithoutAssignee } = validInput;
            
            expect(createIssueSchema.safeParse(inputWithoutAssignee).success).toBe(true);
        });

        it('accepts an issue with explicitly no assignee_id', () => {
            expect(createIssueSchema.safeParse({ ...validInput, assignee_id: null }).success).toBe(true);
        });

        it('rejects an issue with assignee_id value below boundary', () => {
            expect(createIssueSchema.safeParse({ ...validInput, assignee_id: 0 }).success).toBe(false);
        });

        it('rejects an issue with assignee_id as decimal value', () => {
            expect(createIssueSchema.safeParse({ ...validInput, assignee_id: 42.4 }).success).toBe(false);
        });

        it('rejects an issue with assignee_id value that is not a number', () => {
            expect(createIssueSchema.safeParse({ ...validInput, assignee_id: 'NaN' }).success).toBe(false);
        });
    });

});

describe('updateIssueSchema', () => {
    const validInput = {
        title: 'title',
        description: 'This is a test description',
        priority: 'low',
        status: 'open',
        assignee_id: 12345,
    };

    it('accepts an issue with valid inputs (happy path)', () => {
        expect(updateIssueSchema.safeParse(validInput).success).toBe(true);
    });

    it('accepts an issue with on one input', () => {
        expect(updateIssueSchema.safeParse({ title: 'title' }).success).toBe(true);
    });
   
    it('rejects an issue with no inputs', () => {
        expect(updateIssueSchema.safeParse({}).success).toBe(false);
    });
    
    describe('title field validation', () => {
        it('rejects an issue when title is below boundary', () => {
            expect(updateIssueSchema.safeParse({ ...validInput, title: 'qw' }).success).toBe(false);
        });

        it('accepts an issue when title is at lower boundary', () => {
            expect(updateIssueSchema.safeParse({ ...validInput, title: 'qwe' }).success).toBe(true);
        });

        it('accepts an issue when title is at upper boundary', () => {
            expect(updateIssueSchema.safeParse({ ...validInput, title: 'A'.repeat(120) }).success).toBe(true);
        });

        it('rejects an issue when title is above upper boundary', () => {
            expect(updateIssueSchema.safeParse({ ...validInput, title: 'A'.repeat(121) }).success).toBe(false);
        });
    });

    describe('description field validation', () => {
        it('accepts an issue when desc field is at upper boundary', () => {
            expect(updateIssueSchema.safeParse({ ...validInput, description: 'A'.repeat(5000) }).success).toBe(true);
        });

        it('rejects an issue when desc field is over upper boundary', () => {
            expect(updateIssueSchema.safeParse({ ...validInput, description: 'A'.repeat(5001) }).success).toBe(false);
        });
    });

    describe('priority field validation', () => {
        const { priority, ...inputWithoutPriority } = validInput;

        it('rejects a issue when priority has invalid value', () => {
            expect(updateIssueSchema.safeParse({ ...inputWithoutPriority, priority: 'notapriority' }).success).toBe(false);
        });
    });

    describe('status field validation', () => {
        const { status, ...inputWithoutStatus } = validInput;

        it('rejects a issue when status has invalid value', () => {
            expect(updateIssueSchema.safeParse({ ...inputWithoutStatus, status: 'notastatus' }).success).toBe(false);
        });
    });
   
  

    // status with invalid value

    // assignee_id negative value
    // assignee_id nullable value
    // assignee_id omitted value
    // assignee_id decimal value
    // assignee_id string value
});