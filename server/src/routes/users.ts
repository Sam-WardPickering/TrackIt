import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/authenticate.js';
import { listUsers } from '../db/users.js';

export const usersRouter = Router();

usersRouter.use(authenticate);

// Any authenticated user can list users (needed for the assignee dropdown).
usersRouter.get('/', (_req, res) => {
  res.json({ users: listUsers() });
});

// Admin-only endpoint — a clean RBAC target for the security suite.
usersRouter.get('/admin/stats', requireAdmin, (_req, res) => {
  const users = listUsers();
  res.json({
    total_users: users.length,
    admins: users.filter((u) => u.role === 'admin').length,
  });
});
