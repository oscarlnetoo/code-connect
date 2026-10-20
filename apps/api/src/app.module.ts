import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { MeModule } from './users/me/me.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  // MeModule before UsersModule so /users/me never falls into a /users/:id route.
  imports: [AuthModule, MeModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
