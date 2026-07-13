import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { AuthPayload, UserRole } from '../types/index.js';

/**
 * Auth utilities.
 *
 * SECURITY NOTES:
 * - Passwords are hashed with bcrypt (salted, slow). The security suite verifies
 *   the stored value is never the plaintext password.
 * - JWTs are signed with a secret from the environment. The security suite verifies
 *   that tampered or unsigned tokens are rejected.
 *
 * JWT_SECRET falls back to a dev-only value; in CI/prod it MUST be set via env.
 */
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me';
const TOKEN_TTL = '2h';
const BCRYPT_ROUNDS = 10;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL });
}

export function verifyToken(token: string): AuthPayload {
  const decoded = jwt.verify(token, JWT_SECRET);
  // jwt.verify returns string | JwtPayload; we narrow to our shape.
  if (typeof decoded === 'string' || !('userId' in decoded) || !('role' in decoded)) {
    throw new Error('Invalid token payload');
  }
  return { userId: decoded.userId as number, role: decoded.role as UserRole };
}
