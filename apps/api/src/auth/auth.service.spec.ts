import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { UsersRepository } from '../users/users.repository.js';
import { AuthService } from './auth.service.js';
import { JwtPayload } from './jwt-payload.js';
import { PasswordHasher } from './password-hasher.js';

describe('AuthService', () => {
  let service: AuthService;
  let jwt: JwtService;
  let userId: string;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersRepository,
        PasswordHasher,
        { provide: JwtService, useValue: new JwtService({ secret: 'test' }) },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
    jwt = moduleRef.get(JwtService);
    const hasher = moduleRef.get(PasswordHasher);
    const user = moduleRef.get(UsersRepository).create({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      passwordHash: await hasher.hash('s3cret-pass'),
    });
    userId = user.id;
  });

  it('returns a bearer token carrying the user id and email', async () => {
    const result = await service.login({
      email: 'ada@example.com',
      password: 's3cret-pass',
    });

    expect(result.tokenType).toBe('Bearer');
    expect(result.expiresIn).toBe(3600);
    const payload = await jwt.verifyAsync<JwtPayload>(result.accessToken);
    expect(payload.sub).toBe(userId);
    expect(payload.email).toBe('ada@example.com');
  });

  it('rejects a wrong password', async () => {
    await expect(
      service.login({ email: 'ada@example.com', password: 'wrong' }),
    ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));
  });

  it('rejects an unknown email with the same message', async () => {
    await expect(
      service.login({ email: 'nobody@example.com', password: 's3cret-pass' }),
    ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));
  });
});
