import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard.js';

function contextFor(authorization?: string) {
  const request: { headers: Record<string, string>; user?: unknown } = {
    headers: authorization ? { authorization } : {},
  };
  const context = {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
  return { context, request };
}

describe('JwtAuthGuard', () => {
  const jwtService = new JwtService({ secret: 'test-secret' });
  const guard = new JwtAuthGuard(jwtService);
  const payload = { sub: 'user-1', email: 'ada@example.com' };

  it('attaches the token payload to request.user for a valid token', async () => {
    const token = await jwtService.signAsync(payload);
    const { context, request } = contextFor(`Bearer ${token}`);

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(request.user).toMatchObject(payload);
  });

  it('rejects a request without an Authorization header', async () => {
    const { context } = contextFor();
    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('rejects a non-Bearer scheme', async () => {
    const token = await jwtService.signAsync(payload);
    const { context } = contextFor(`Basic ${token}`);
    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('rejects a Bearer header without a token', async () => {
    const { context } = contextFor('Bearer');
    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('rejects a token signed with another secret', async () => {
    const token = await new JwtService({ secret: 'other' }).signAsync(payload);
    const { context, request } = contextFor(`Bearer ${token}`);

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(request.user).toBeUndefined();
  });

  it('rejects an expired token', async () => {
    const token = await jwtService.signAsync({
      ...payload,
      exp: Math.floor(Date.now() / 1000) - 60,
    });
    const { context } = contextFor(`Bearer ${token}`);

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
