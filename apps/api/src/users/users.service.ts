import { ConflictException, Injectable } from '@nestjs/common';
import { PasswordHasher } from '../auth/password-hasher.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { User } from './user.entity.js';
import { UsersRepository } from './users.repository.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async register(dto: CreateUserDto): Promise<User> {
    if (this.usersRepository.findByEmail(dto.email)) {
      throw new ConflictException('Email is already registered');
    }
    const passwordHash = await this.passwordHasher.hash(dto.password);
    return this.usersRepository.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
    });
  }
}
