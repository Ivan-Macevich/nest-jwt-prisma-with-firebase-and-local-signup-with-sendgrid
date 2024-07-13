import { Body, Controller, Post } from '@nestjs/common';
import { EmailVerificationService } from '@app/email-verification/email-verification.service';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { SendEmailDto } from './dto/send-email.dto';
import { Public } from '@libs/security/decorators/public.decorator';

@Controller('email-verification')
export class EmailVerificationController {
  constructor(
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @Public()
  @Post('confirm')
  async confirm(@Body() confirmData: ConfirmEmailDto) {
    await this.emailVerificationService.confimEmail(confirmData.token);
  }

  @Post('send')
  async register(@Body() registrationData: SendEmailDto) {
    return await this.emailVerificationService.sendVerificationLink(
      registrationData.email,
    );
  }
}
