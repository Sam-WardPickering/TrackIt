import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, signToken, verifyToken } from '../../../server/src/logic/auth';
import type { AuthPayload, UserRole } from '../../../server/src/types/index';


