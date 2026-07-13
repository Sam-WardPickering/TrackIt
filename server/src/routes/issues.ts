import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { validateBody } from '../middleware/validate.js';
import { createIssueSchema, updateIssueSchema } from '../validation/schemas.js';
import {
  createIssue,
  getIssueById,
  listIssues,
  updateIssue,
  deleteIssue,
  type IssueFilters,
} from '../db/issues.js';
import { getUserById } from '../db/users.js';
import { canEditIssue, canDeleteIssue } from '../logic/permissions.js';
import { canTransition } from '../logic/statusTransitions.js';
import type { IssueStatus, IssuePriority } from '../types/index.js';

export const issuesRouter = Router();

// All issue routes require authentication.
issuesRouter.use(authenticate);

issuesRouter.get('/', (req, res) => {
  const filters: IssueFilters = {};
  if (typeof req.query.status === 'string') filters.status = req.query.status as IssueStatus;
  if (typeof req.query.priority === 'string')
    filters.priority = req.query.priority as IssuePriority;
  if (typeof req.query.assignee_id === 'string') {
    const parsed = Number(req.query.assignee_id);
    if (Number.isInteger(parsed)) filters.assignee_id = parsed;
  }
  res.json({ issues: listIssues(filters) });
});

issuesRouter.get('/:id', (req, res) => {
  const issue = getIssueById(Number(req.params.id));
  if (!issue) {
    res.status(404).json({ error: 'Issue not found' });
    return;
  }
  res.json({ issue });
});

issuesRouter.post('/', validateBody(createIssueSchema), (req, res) => {
  const { title, description, priority, assignee_id } = req.body;

  if (assignee_id != null && !getUserById(assignee_id)) {
    res.status(400).json({ error: 'Assignee does not exist' });
    return;
  }

  const issue = createIssue({
    title,
    description,
    priority,
    reporter_id: req.auth!.userId,
    assignee_id: assignee_id ?? null,
  });
  res.status(201).json({ issue });
});

issuesRouter.patch('/:id', validateBody(updateIssueSchema), (req, res) => {
  const issue = getIssueById(Number(req.params.id));
  if (!issue) {
    res.status(404).json({ error: 'Issue not found' });
    return;
  }

  const user = getUserById(req.auth!.userId)!;
  if (!canEditIssue(user, issue)) {
    res.status(403).json({ error: 'You do not have permission to edit this issue' });
    return;
  }

  // Enforce the status workflow if a status change is requested.
  if (req.body.status && req.body.status !== issue.status) {
    if (!canTransition(issue.status, req.body.status)) {
      res.status(422).json({
        error: `Cannot transition from '${issue.status}' to '${req.body.status}'`,
      });
      return;
    }
  }

  if (req.body.assignee_id != null && !getUserById(req.body.assignee_id)) {
    res.status(400).json({ error: 'Assignee does not exist' });
    return;
  }

  const updated = updateIssue(issue.id, req.body);
  res.json({ issue: updated });
});

issuesRouter.delete('/:id', (req, res) => {
  const issue = getIssueById(Number(req.params.id));
  if (!issue) {
    res.status(404).json({ error: 'Issue not found' });
    return;
  }

  const user = getUserById(req.auth!.userId)!;
  if (!canDeleteIssue(user, issue)) {
    res.status(403).json({ error: 'You do not have permission to delete this issue' });
    return;
  }

  deleteIssue(issue.id);
  res.status(204).send();
});
