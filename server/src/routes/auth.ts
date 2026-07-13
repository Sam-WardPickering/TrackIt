import { Router } from 'express';
import { validateBody } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validation/schemas.js';
import { createUser, getUserByEmail } from '../db/users.js';
import { hashPassword, verifyPassword, signToken } from '../logic/auth.js';

export const authRouter = Router();

authRouter.post('/register', validateBody(registerSchema), async (req, res) => {
  const { email, password, name } = req.body;

  const existing = getUserByEmail(email);
  if (existing) {
    // Do not reveal whether it was the email specifically at fault beyond a 409.
    res.status(409).json({ error: 'Email already registered' });
    return;
  }

  const passwordHash = await hashPassword(password);
  const user = createUser(email, name, passwordHash);
  const token = signToken({ userId: user.id, role: user.role });

  res.status(201).json({ user, token });
});

authRouter.post('/login', validateBody(loginSchema), async (req, res) => {
  const { email, password } = req.body;

  const user = getUserByEmail(email);
  // Uniform error + timing-agnostic path: always compare against *something*.
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = signToken({ userId: user.id, role: user.role });
  const { password_hash, ...safeUser } = user;
  res.json({ user: safeUser, token });
});
