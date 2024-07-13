import { Module } from '@nestjs/common';
import { AuthController } from '@app/auth/auth.controller';
import { AuthService } from '@app/auth/auth.service';
import { PrismaService } from '@libs/prisma/prisma.service';
import { AccessTokenStrategy } from '@app/auth/strategies/access-token.strategy';
import { RefreshTokenStrategy } from '@app/auth/strategies/refresh-token.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersModule } from '@app/users/users.module';
import { EmailVerificationModule } from '@app/email-verification/email-verification.module';
import { SecurityModule } from '@libs/security/security.module';
import { EmailModule } from '@app/email/email.module';

@Module({
  imports: [
    JwtModule.register({}),
    UsersModule,
    EmailVerificationModule,
    SecurityModule,
    EmailModule,
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
