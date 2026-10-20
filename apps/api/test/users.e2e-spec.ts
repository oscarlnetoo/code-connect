import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { configureApp } from './../src/app.setup.js';

describe('POST /v1/users (e2e)', () => {
  let app: INestApplication<App>;

  const valid = {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    password: 'super-secret',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  const post = (body: object) =>
    request(app.getHttpServer()).post('/v1/users').send(body);

  it('creates the user and returns 201 with Location and no password', async () => {
    const res = await post({
      ...valid,
      name: '  Ada Lovelace  ',
      email: '  Ada@Example.COM ',
    }).expect(201);

    expect(res.body).toEqual({
      id: expect.any(String),
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      createdAt: expect.any(String),
    });
    expect(res.body).not.toHaveProperty('password');
    expect(res.body).not.toHaveProperty('passwordHash');
    expect(res.headers.location).toBe(`/v1/users/${res.body.id}`);
  });

  it('returns 409 when the email is already registered', async () => {
    await post(valid).expect(201);
    await post({ ...valid, email: 'ADA@example.com' }).expect(409);
  });

  it.each([
    ['an invalid email', { ...valid, email: 'not-an-email' }],
    ['a short password', { ...valid, password: 'short' }],
    ['a too long password', { ...valid, password: 'x'.repeat(73) }],
    ['a blank name', { ...valid, name: '   ' }],
    ['missing fields', {}],
    ['unknown extra fields', { ...valid, role: 'admin' }],
  ])('returns 400 for %s', async (_case, body) => {
    await post(body).expect(400);
  });
});
