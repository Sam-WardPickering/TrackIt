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
-Admin can edit ANY issue.
-Admin can delete ANY issue.

-Member can edit issue they are REPORTER of. 
-Member can edit issue they are ASSIGNEE of.

-Member who is REPORTER can delete issue.

-Member who is ASSIGNEE cannot delete issue.
-Member who is neither REPORTER or ASSIGNEE cannot edit issue.
-Member who is neither REPORTER or ASSIGNEE cannot delete issue.

*/

describe('canEditIssue', () => {

});

describe('canDeleteIssue', () => {

});
