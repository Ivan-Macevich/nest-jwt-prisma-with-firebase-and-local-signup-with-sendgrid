import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioService {
  private twilioClient: Twilio;
  private verifyServiceSid: string;

  constructor(private configService: ConfigService) {
    this.twilioClient = new Twilio(
      this.configService.get<string>('TWILIO_ACCOUNT_SID'),
      this.configService.get<string>('TWILIO_AUTH_TOKEN'),
    );
    this.verifyServiceSid = this.configService.get<string>(
      'TWILIO_VERIFY_SERVICE_SID',
    );
  }

  async sendVerificationCode(
    to: string,
    channel: 'sms' | 'email' = 'sms',
  ): Promise<boolean> {
    try {
      const verification = await this.twilioClient.verify.v2
        .services(this.verifyServiceSid)
        .verifications.create({
          to,
          channel,
        });

      return verification.status === 'pending';
    } catch (error) {
      console.error('Error sending verification code:', error);
      return false;
    }
  }

  async verifyCode(to: string, code: string): Promise<boolean> {
    try {
      const verification = await this.twilioClient.verify.v2
        .services(this.verifyServiceSid)
        .verificationChecks.create({
          to,
          code,
        });

      return verification.status === 'approved';
    } catch (error) {
      console.error('Error verifying code:', error);
      return false;
    }
  }
}
