import { PrismaService } from '@libs/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PhoneVerification } from '@prisma/client';

@Injectable()
export class PhoneVerificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async markPhoneVerified(phoneNumber: string): Promise<PhoneVerification> {
    return this.prisma.phoneVerification.create({
      data: {
        phoneNumber: phoneNumber,
        verified: true,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // Expires in 10 minutes
      },
    });
  }

  async isPhoneVerified(phoneNumber: string): Promise<boolean> {
    const verification = await this.prisma.phoneVerification.findFirst({
      where: {
        phoneNumber: phoneNumber,
        verified: true,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
    return !!verification;
  }
}
