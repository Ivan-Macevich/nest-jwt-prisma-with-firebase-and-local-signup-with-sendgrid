import { Module } from '@nestjs/common';
import { SecurityService } from './security.service';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '@app/users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [UsersModule],
  controllers: [],
  providers: [SecurityService, JwtService, JwtStrategy],
  exports: [SecurityService],
})
export class SecurityModule {}
