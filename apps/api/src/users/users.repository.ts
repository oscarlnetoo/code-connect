import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { User } from './user.entity.js';

// In-memory storage: data lives only for the lifetime of the process.
@Injectable()
export class UsersRepository {
  private readonly users: User[] = [];

  create(data: Omit<User, 'id' | 'createdAt'>): User {
    const user: User = { ...data, id: randomUUID(), createdAt: new Date() };
    this.users.push(user);
    return user;
  }

  findById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  findByEmail(email: string): User | undefined {
    const normalized = email.toLowerCase();
    return this.users.find((user) => user.email.toLowerCase() === normalized);
  }
}
