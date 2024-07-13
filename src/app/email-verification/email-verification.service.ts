import { EmailService } from '@app/email/email.service';
import { UsersRepository } from '@app/users/repos/users.repository';
import { SecurityService } from '@libs/security/security.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class EmailVerificationService {
  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
    private readonly securityService: SecurityService,
  ) {}

  async sendVerificationLink(email: string): Promise<boolean> {
    try {
      const emailToken = await this.securityService.signMailToken(email);

      const url = `${this.configService.get<string>('email.emailLink')}?token=${emailToken}`;

      await this.emailService.sendMail({
        to: email,
        subject: 'Email Verification',
        text: `Please click the following link to verify your email: ${url}`,
      });

      await this.usersRepository.updateEmailToken({ email, emailToken });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async decodeConfirmationToken(token: string): Promise<string> {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('email.secret'),
      });
      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException('Invalid Token');
    } catch (err) {
      throw new BadRequestException('Invalid Token');
    }
  }

  async confimEmail(emailToken: string) {
    const email = await this.decodeConfirmationToken(emailToken);
    if (!email) {
      throw new BadRequestException('Email already confirmed');
    }
    const user = await this.usersRepository.findOneByEmailAndEmailToken({
      email,
      emailToken,
    });
    if (!user) {
      throw new BadRequestException('Invalid Token');
    }
    if (user.verified) {
      throw new BadRequestException('Email already confirmed');
    }
    return await this.usersRepository.verifyUser(user);
  }
}
