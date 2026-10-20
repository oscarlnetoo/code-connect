import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { JwtPayload } from '../jwt-payload.js';
import type { AuthenticatedRequest } from '../guards/authenticated-request.js';

// Injects the JWT claims attached by JwtAuthGuard. Only use on guarded routes.
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): JwtPayload =>
    context.switchToHttp().getRequest<AuthenticatedRequest>().user,
);
