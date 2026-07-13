import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import { issuesRouter } from './routes/issues.js';
import { usersRouter } from './routes/users.js';

/**
 * App factory.
 *
 * The Express app is built separately from the server bootstrap (index.ts) so the
 * test suite can import and exercise the app directly, or hit it over HTTP, without
 * the process calling listen() itself. This separation is a deliberate testing seam.
 */
export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/api/auth', authRouter);
  app.use('/api/issues', issuesRouter);
  app.use('/api/users', usersRouter);

  // Fallback 404 for unknown routes.
  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  return app;
}
