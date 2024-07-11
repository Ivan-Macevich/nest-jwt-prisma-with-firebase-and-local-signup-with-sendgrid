import { Module } from '@nestjs/common';
import { AuthController } from '@app/auth/auth.controller';
import { AuthService } from '@app/auth/auth.service';
import { UsersService } from '@app/users/users.service';
import { SecurityService } from '@libs/security/security.service';
import { PrismaService } from '@libs/prisma/prisma.service';
import { AccessTokenStrategy } from '@app/auth/strategies/access-token.strategy';
import { RefreshTokenStrategy } from '@app/auth/strategies/refresh-token.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersRepository } from '@app/users/repos/users.repository';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    UsersRepository,
    SecurityService,
    PrismaService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    JwtService,
  ],
})
export class AuthModule {}
