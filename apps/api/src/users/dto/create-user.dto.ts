import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// Only touch strings; anything else is left for the validators to reject.
const trim = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

const trimAndLowercase = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

export class CreateUserDto {
  @ApiProperty({ example: 'Ada Lovelace', minLength: 1, maxLength: 100 })
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'ada@example.com',
    format: 'email',
    description: 'Stored trimmed and lowercased; must be unique.',
  })
  @Transform(trimAndLowercase)
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'correct-horse-battery',
    format: 'password',
    minLength: 8,
    maxLength: 72,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;
}
