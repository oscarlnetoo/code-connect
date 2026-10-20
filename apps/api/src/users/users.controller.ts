import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UserResponseDto } from './dto/user-response.dto.js';
import { UsersService } from './users.service.js';

@ApiTags('users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    description: 'User created.',
    type: UserResponseDto,
    headers: {
      Location: {
        description: 'URL of the created user',
        schema: { type: 'string', example: '/v1/users/{id}' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid, missing or unknown fields.',
  })
  @ApiConflictResponse({ description: 'Email is already registered.' })
  async create(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.register(dto);
    res.location(`/v1/users/${user.id}`);
    return UserResponseDto.fromEntity(user);
  }
}
