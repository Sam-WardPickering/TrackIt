import { z } from 'zod';

/**
 * Request validation schemas.
 *
 * TESTING SEAM (unit + security): Every schema here is a pure validation boundary.
 * Unit tests should cover valid input, each individual constraint failure, and
 * boundary values (min/max lengths). Security tests should confirm oversized or
 * malformed payloads are rejected at this layer before touching the database.
 */

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  // Deliberately enforce a real-world password policy — a documented unit-test target.
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be at most 100 characters'),
  name: z.string().min(1, 'Name is required').max(80, 'Name is too long'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const issueStatusSchema = z.enum(['open', 'in_progress', 'resolved', 'closed']);
export const issuePrioritySchema = z.enum(['low', 'medium', 'high', 'critical']);

export const createIssueSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(120, 'Title is too long'),
  description: z.string().max(5000, 'Description is too long').default(''),
  priority: issuePrioritySchema.default('medium'),
  assignee_id: z.number().int().positive().nullable().optional(),
});

export const updateIssueSchema = z
  .object({
    title: z.string().min(3).max(120).optional(),
    description: z.string().max(5000).optional(),
    priority: issuePrioritySchema.optional(),
    status: issueStatusSchema.optional(),
    assignee_id: z.number().int().positive().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateIssueInput = z.infer<typeof createIssueSchema>;
export type UpdateIssueInput = z.infer<typeof updateIssueSchema>;
