import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaModule } from '@libs/prisma/prisma.module';
import { OtpModule } from '@libs/otp/otp.module';
import { JwtModule } from '@nestjs/jwt';
import { FirebaseModule } from '@libs/firebase/firebase.module';
import { SecurityService } from '@libs/security/security.service';
import { UsersRepository } from '@app/users/repos/users.repository';
import { AuthController } from './auth.controller';

@Module({
  imports: [PrismaModule, OtpModule, JwtModule, FirebaseModule],
  providers: [AuthService, UsersRepository, SecurityService],
  controllers: [AuthController],
  exports: [AuthService, SecurityService],
})
export class AuthModule {}
