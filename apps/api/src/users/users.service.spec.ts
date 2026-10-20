import { ConflictException } from '@nestjs/common';
import { PasswordHasher } from '../auth/password-hasher.js';
import { UsersRepository } from './users.repository.js';
import { UsersService } from './users.service.js';

describe('UsersService', () => {
  let repository: UsersRepository;
  let hasher: PasswordHasher;
  let service: UsersService;

  beforeEach(() => {
    repository = new UsersRepository();
    hasher = new PasswordHasher();
    service = new UsersService(repository, hasher);
  });

  describe('register', () => {
    const dto = {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'super-secret',
    };

    it('stores the user with a hashed password, never the plain text', async () => {
      const user = await service.register(dto);

      expect(user).toMatchObject({ name: dto.name, email: dto.email });
      expect(user.id).toEqual(expect.any(String));
      expect(user.passwordHash).not.toContain(dto.password);
      await expect(
        hasher.verify(dto.password, user.passwordHash),
      ).resolves.toBe(true);
      expect(repository.findById(user.id)).toBe(user);
    });

    it('rejects a duplicate email regardless of case', async () => {
      await service.register(dto);

      await expect(
        service.register({ ...dto, email: 'ADA@Example.COM' }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });
});
