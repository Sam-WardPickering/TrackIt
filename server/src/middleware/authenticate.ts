import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../logic/auth.js';
import type { AuthPayload } from '../types/index.js';

/**
 * Authentication middleware.
 *
 * Extracts a Bearer token, verifies it, and attaches the payload to req.auth.
 * On any failure it responds 401 — the security suite fires missing, malformed,
 * and tampered tokens at protected routes and asserts this rejects them.
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or malformed Authorization header' });
    return;
  }

  const token = header.slice('Bearer '.length);

  try {
    req.auth = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Role guard. Must run after authenticate.
 * Documented testing seam for role-based access control (RBAC).
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.auth?.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  next();
}
