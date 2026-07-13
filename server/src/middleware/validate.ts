import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

/**
 * Generic body-validation middleware.
 *
 * Parses req.body against a Zod schema. On failure returns 400 with a structured
 * list of field errors. On success it replaces req.body with the *parsed* (and
 * defaulted/coerced) data so handlers receive clean, typed input.
 *
 * TESTING SEAM (api + security): every mutating endpoint runs input through here,
 * so tests can assert consistent 400 shapes for bad input across the whole API.
 */
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
      return;
    }
    req.body = result.data;
    next();
  };
}
