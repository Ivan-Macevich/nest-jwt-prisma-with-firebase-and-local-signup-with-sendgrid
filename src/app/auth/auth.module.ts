import { Module } from '@nestjs/common';
import { AuthController } from '@app/auth/auth.controller';
import { AuthService } from '@app/auth/auth.service';
import { PrismaService } from '@libs/prisma/prisma.service';
import { AccessTokenStrategy } from '@app/auth/strategies/access-token.strategy';
import { RefreshTokenStrategy } from '@app/auth/strategies/refresh-token.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersModule } from '@app/users/users.module';
import { SecurityModule } from '@libs/security/security.module';
import { TwilioModule } from '../../libs/twilio/twilio.module';
import { PhoneVerificationModule } from '../phone-verification/phone-verification.module';

@Module({
  imports: [
    JwtModule.register({}),
    UsersModule,
    SecurityModule,
    TwilioModule,
    PhoneVerificationModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    JwtService,
  ],
})
export class AuthModule {}
