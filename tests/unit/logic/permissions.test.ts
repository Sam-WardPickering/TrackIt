import { describe, it, expect } from 'vitest';
import { Issue, User } from '../../../server/src/types';
import { canEditIssue, canDeleteIssue } from '../../../server/src/logic/permissions';

const mockIssue = (overrides: Partial<Issue>): Issue => ({
  id: 1,
  title: 'test',
  description: '',
  status: 'open',
  priority: 'medium',
  reporter_id: 1,
  assignee_id: null,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  ...overrides,
});

/*
Tests:
-Admin can delete ANY issue.
-Member who is REPORTER can delete issue.

-Member who is ASSIGNEE cannot delete issue.
-Member who is neither REPORTER or ASSIGNEE cannot delete issue.

*/

describe('canEditIssue', () => {
    it('should allow an admin to edit an issue', () => {
        const admin = { id: 4, role: 'admin' as const };
        const issue = mockIssue({});

        expect(canEditIssue(admin, issue)).toBe(true);
    });

    it('should allow a member to edit issue they are reporter of', () => {
        const member = { id: 10, role: 'member' as const };
        const issue = mockIssue({ reporter_id: 10 });

        expect(canEditIssue(member, issue)).toBe(true);
    });

    it('should allow a member to edit issue they are assigned to', () => {
        const member = { id: 15, role: 'member' as const };
        const issue = mockIssue({ assignee_id: 15 });

        expect(canEditIssue(member, issue)).toBe(true);
    });

    it('should not allow a member who is neither reporter nor asignee to edit', () => {
        const member = { id: 99, role: 'member' as const };
        const issue = mockIssue({ reporter_id: 110, assignee_id: 111 });

        expect(canEditIssue(member, issue)).toBe(false);
    });
});

describe('canDeleteIssue', () => {
    it('should allow an admin to delete an issue', () => {
        const admin = { id: 11, role: 'admin' as const };
        const issue = mockIssue({});

        expect(canDeleteIssue(admin, issue)).toBe(true);
    });

    
});
