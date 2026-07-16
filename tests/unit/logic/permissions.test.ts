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

describe('canEditIssue', () => {

});

describe('canDeleteIssue', () => {

});
