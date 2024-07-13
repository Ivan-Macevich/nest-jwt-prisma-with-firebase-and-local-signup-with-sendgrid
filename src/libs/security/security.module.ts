import { Module } from '@nestjs/common';
import { SecurityService } from './security.service';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '@app/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [],
  providers: [SecurityService, JwtService],
  exports: [SecurityService],
})
export class SecurityModule {}
