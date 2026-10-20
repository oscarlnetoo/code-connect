import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { TokenResponseDto } from './dto/token-response.dto.js';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Issuing a token creates no addressable resource, so 200 (OAuth2 style).
  @Post('tokens')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Issue an access token (login)' })
  @ApiOkResponse({ type: TokenResponseDto })
  @ApiBadRequestResponse({ description: 'Malformed or invalid body' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  login(@Body() dto: LoginDto): Promise<TokenResponseDto> {
    return this.authService.login(dto);
  }
}
