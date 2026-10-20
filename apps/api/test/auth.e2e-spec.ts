import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.setup.js';
import { JwtPayload } from '../src/auth/jwt-payload.js';
import { PasswordHasher } from '../src/auth/password-hasher.js';
import { UsersRepository } from '../src/users/users.repository.js';

describe('POST /v1/auth/tokens (e2e)', () => {
  let app: INestApplication<App>;
  let userId: string;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();

    const hasher = app.get(PasswordHasher);
    const user = app.get(UsersRepository).create({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      passwordHash: await hasher.hash('s3cret-pass'),
    });
    userId = user.id;
  });

  afterEach(async () => {
    await app.close();
  });

  it('returns 200 with an access token', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/auth/tokens')
      .send({ email: '  ADA@example.com ', password: 's3cret-pass' })
      .expect(200);

    expect(res.body).toMatchObject({ tokenType: 'Bearer', expiresIn: 3600 });
    const payload = await app
      .get(JwtService)
      .verifyAsync<JwtPayload>(res.body.accessToken);
    expect(payload).toMatchObject({ sub: userId, email: 'ada@example.com' });
  });

  it('returns 401 on a wrong password', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/auth/tokens')
      .send({ email: 'ada@example.com', password: 'wrong' })
      .expect(401);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('returns 401 on an unknown email', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/auth/tokens')
      .send({ email: 'nobody@example.com', password: 's3cret-pass' })
      .expect(401);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('returns 400 on an invalid body', async () => {
    await request(app.getHttpServer())
      .post('/v1/auth/tokens')
      .send({ email: 'not-an-email', password: '' })
      .expect(400);
  });
});
