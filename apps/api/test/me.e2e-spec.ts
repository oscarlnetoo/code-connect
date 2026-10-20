import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { configureApp } from './../src/app.setup.js';
import { AuthModule } from './../src/auth/auth.module.js';
import { UsersModule } from './../src/users/users.module.js';
import { MeModule } from './../src/users/me/me.module.js';
import { UsersRepository } from './../src/users/users.repository.js';
import { User } from './../src/users/user.entity.js';

describe('GET /v1/users/me (e2e)', () => {
  let app: INestApplication<App>;
  let jwtService: JwtService;
  let user: User;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, UsersModule, MeModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();

    jwtService = app.get(JwtService);
    user = app.get(UsersRepository).create({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      passwordHash: 'not-a-real-hash',
    });
  });

  afterEach(async () => {
    await app.close();
  });

  it('returns the authenticated user without the password hash', async () => {
    const token = await jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    const response = await request(app.getHttpServer())
      .get('/v1/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual({
      id: user.id,
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      createdAt: user.createdAt.toISOString(),
    });
    expect(response.body).not.toHaveProperty('passwordHash');
  });

  it('returns 401 without a token', () => {
    return request(app.getHttpServer()).get('/v1/users/me').expect(401);
  });

  it('returns 401 with a garbage token', () => {
    return request(app.getHttpServer())
      .get('/v1/users/me')
      .set('Authorization', 'Bearer not.a.jwt')
      .expect(401);
  });

  it('returns 401 when the token user no longer exists', async () => {
    const token = await jwtService.signAsync({
      sub: '00000000-0000-0000-0000-000000000000',
      email: 'ghost@example.com',
    });

    await request(app.getHttpServer())
      .get('/v1/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });
});
