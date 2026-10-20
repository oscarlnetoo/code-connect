import {
  Controller,
  Get,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import type { JwtPayload } from '../../auth/jwt-payload.js';
import { UserResponseDto } from '../dto/user-response.dto.js';
import { UsersRepository } from '../users.repository.js';

// "me" alias for the authenticated user's resource.
@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'users/me', version: '1' })
export class MeController {
  constructor(private readonly usersRepository: UsersRepository) {}

  @Get()
  @ApiOperation({ summary: 'Get the authenticated user' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiUnauthorizedResponse({
    description:
      'Missing, invalid or expired token, or the user no longer exists',
  })
  findMe(@CurrentUser() payload: JwtPayload): UserResponseDto {
    const user = this.usersRepository.findById(payload.sub);
    if (!user) {
      // In-memory data is lost on restart while issued tokens stay valid.
      throw new UnauthorizedException('User no longer exists');
    }
    return UserResponseDto.fromEntity(user);
  }
}
