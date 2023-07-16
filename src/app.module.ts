import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthModule } from './auth/auth.module';
import { jwtConstants } from './auth/constants';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    JwtModule.register({
      global:      true,
      secret:      jwtConstants.secret,
      signOptions: { expiresIn: '15m' },
    }),
    UsersModule,
  ],
})
export class AppModule {}
