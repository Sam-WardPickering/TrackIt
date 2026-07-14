import { initSchema, db } from './database.js';
import { createUser } from './users.js';
import { createIssue, updateIssue } from './issues.js';
import { hashPassword } from '../logic/auth.js';

/**
 * Seed script — creates a known set of users and issues for local dev and as a
 * predictable fixture baseline for E2E tests.
 *
 * Issues are created (always 'open' by domain rule) and then moved through the
 * workflow so the seeded data shows a realistic spread of statuses.
 *
 * Credentials (dev only):
 *   admin@trackit.test  / Password123
 *   member@trackit.test / Password123
 */
async function seed() {
  initSchema();

  // Reset for a deterministic baseline.
  db.exec('DELETE FROM issues; DELETE FROM users;');
  db.exec(`DELETE FROM sqlite_sequence WHERE name IN ('issues','users');`);

  const pw = await hashPassword('Password123');

  const admin = createUser('admin@trackit.test', 'Ada Admin', pw, 'admin');
  const member = createUser('member@trackit.test', 'Moe Member', pw, 'member');

  const loginBug = createIssue({
    title: 'Login button misaligned on mobile',
    description: 'On viewport < 375px the login button overflows its container.',
    priority: 'high',
    reporter_id: member.id,
    assignee_id: admin.id,
  });

  const searchBug = createIssue({
    title: 'Search returns stale results',
    description: 'Rapid queries occasionally show results for a previous term.',
    priority: 'critical',
    reporter_id: admin.id,
    assignee_id: null,
  });

  const typo = createIssue({
    title: 'Typo in onboarding email',
    description: '"Welcom" should be "Welcome".',
    priority: 'low',
    reporter_id: member.id,
    assignee_id: member.id,
  });

  const perf = createIssue({
    title: 'Dashboard slow to load with many issues',
    description: 'Initial render takes >3s once an account has 500+ issues.',
    priority: 'medium',
    reporter_id: admin.id,
    assignee_id: admin.id,
  });

  // Move some issues along the workflow so statuses vary.
  updateIssue(loginBug.id, { status: 'in_progress' });
  updateIssue(searchBug.id, { status: 'in_progress' });
  updateIssue(typo.id, { status: 'resolved' });
  updateIssue(perf.id, { status: 'closed' });

  console.log('Seeded users and issues (with varied statuses).');
}

seed();
