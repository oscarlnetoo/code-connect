import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/users.repository.js';
import { LoginDto } from './dto/login.dto.js';
import { JWT_EXPIRES_IN_SECONDS } from './auth.constants.js';
import { TokenResponseDto } from './dto/token-response.dto.js';
import { JwtPayload } from './jwt-payload.js';
import { PasswordHasher } from './password-hasher.js';

const INVALID_CREDENTIALS = 'Invalid credentials';

@Injectable()
export class AuthService {
  // Verified against when the email is unknown, so both failure paths cost
  // the same and response timing does not reveal which emails exist.
  private dummyHash?: Promise<string>;

  constructor(
    private readonly users: UsersRepository,
    private readonly hasher: PasswordHasher,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<TokenResponseDto> {
    const user = this.users.findByEmail(dto.email);
    const passwordHash = user?.passwordHash ?? (await this.getDummyHash());
    const valid = await this.hasher.verify(dto.password, passwordHash);
    if (!user || !valid) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = await this.jwt.signAsync(payload);
    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: JWT_EXPIRES_IN_SECONDS,
    };
  }

  private getDummyHash(): Promise<string> {
    this.dummyHash ??= this.hasher.hash('dummy-password-for-timing');
    return this.dummyHash;
  }
}
