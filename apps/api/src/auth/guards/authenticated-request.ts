import type { Request } from 'express';
import type { JwtPayload } from '../jwt-payload.js';

// Request after JwtAuthGuard has verified the token and attached its claims.
export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
