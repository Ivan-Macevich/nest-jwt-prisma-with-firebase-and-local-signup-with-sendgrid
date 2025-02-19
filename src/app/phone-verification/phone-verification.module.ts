import { Module } from '@nestjs/common';
import { PhoneVerificationService } from './phone-verification.service';
import { PhoneVerificationRepository } from './repos/phone-verification.repository';
import { PrismaModule } from '@libs/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PhoneVerificationService, PhoneVerificationRepository],
  exports: [PhoneVerificationService],
})
export class PhoneVerificationModule {}
