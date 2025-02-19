import { Injectable } from '@nestjs/common';
import { PhoneVerificationRepository } from './repos/phone-verification.repository';

@Injectable()
export class PhoneVerificationService {
  constructor(
    private readonly phoneVerificationRepository: PhoneVerificationRepository,
  ) {}

  async markPhoneVerified(phoneNumber: string): Promise<void> {
    await this.phoneVerificationRepository.markPhoneVerified(phoneNumber);
  }

  async isPhoneVerified(phoneNumber: string): Promise<boolean> {
    return this.phoneVerificationRepository.isPhoneVerified(phoneNumber);
  }
}
