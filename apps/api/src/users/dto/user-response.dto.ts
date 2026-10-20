import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user.entity.js';

export class UserResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Ada Lovelace' })
  name: string;

  @ApiProperty({ example: 'ada@example.com' })
  email: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  // Never expose the password hash.
  static fromEntity(user: User): UserResponseDto {
    const { id, name, email, createdAt } = user;
    return { id, name, email, createdAt };
  }
}
