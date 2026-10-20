import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JWT_EXPIRES_IN, JWT_SECRET } from './auth.constants.js';
import { PasswordHasher } from './password-hasher.js';

// Global so any module can inject JwtService and PasswordHasher.
@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_EXPIRES_IN },
    }),
  ],
  providers: [PasswordHasher],
  exports: [PasswordHasher],
})
export class AuthModule {}
