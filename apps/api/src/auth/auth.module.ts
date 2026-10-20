import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module.js';
import { AuthController } from './auth.controller.js';
import { JWT_EXPIRES_IN_SECONDS, JWT_SECRET } from './auth.constants.js';
import { AuthService } from './auth.service.js';
import { PasswordHasher } from './password-hasher.js';

// Global so any module can inject JwtService and PasswordHasher.
@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_EXPIRES_IN_SECONDS },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [PasswordHasher, AuthService],
  exports: [PasswordHasher],
})
export class AuthModule {}
