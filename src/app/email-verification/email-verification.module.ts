import { Module } from '@nestjs/common';
import { EmailVerificationController } from './email-verification.controller';
import { EmailVerificationService } from './email-verification.service';
import { EmailService } from '@app/email/email.service';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '@app/users/users.module';
import { SecurityModule } from '@libs/security/security.module';

@Module({
  imports: [UsersModule, SecurityModule],
  controllers: [EmailVerificationController],
  providers: [EmailVerificationService, EmailService, JwtService],
  exports: [EmailVerificationService],
})
export class EmailVerificationModule {}
