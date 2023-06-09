import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule.register({ session: true }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, SessionSerializer],
  exports: [AuthService],
})
export class AuthModule {}
