import { SecurityService } from '@libs/security/security.service';
import { UsersRepository } from '@app/users/repos/users.repository';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Tokens } from '@common/types/tokens.type';
import { SignUpDto } from '@app/auth/dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { LogOutDto } from './dto/log-out.dto';
import { ConfigService } from '@nestjs/config';
import { TwilioService } from '../../libs/twilio/twilio.service';
import { Role, User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private securityService: SecurityService,
    private configService: ConfigService,
    private twilioService: TwilioService,
  ) {}

  async isPhoneNumberRegistered(phoneNumber: string): Promise<boolean> {
    const user = await this.usersRepository.findOneByPhone(phoneNumber);
    return !!user;
  }

  async isEmailRegistered(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOneByEmail(email);
    if (user) {
      throw new ForbiddenException('Email already registered');
    }
    return true;
  }

  async signUpLocal(signUpDto: SignUpDto): Promise<Tokens> {
    const user = await this.usersRepository.createUser({
      email: signUpDto.email,
      fullName: signUpDto.fullName,
      phoneNumber: signUpDto.phoneNumber,
    });

    const tokens = await this.securityService.signTokens(
      user.id,
      user.email,
      Role.USER,
    );

    await this.securityService.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async signInLocal(signInDto: SignInDto): Promise<{ message: string }> {
    const user = await this.usersRepository.findOneByPhone(
      signInDto.phoneNumber,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const sent = await this.twilioService.sendVerificationCode(
      signInDto.phoneNumber,
    );

    if (!sent) {
      throw new HttpException(
        'Failed to send verification code',
        HttpStatus.BAD_REQUEST,
      );
    }

    return { message: 'Verification code sent successfully' };
  }
  async logIn(signInDto: SignInDto): Promise<Tokens> {
    const user = await this.usersRepository.findOneByPhone(
      signInDto.phoneNumber,
    );

    const tokens = await this.securityService.signTokens(
      user.id,
      user.email,
      user.role,
    );

    await this.securityService.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async logOut(logOutDto: LogOutDto): Promise<User> {
    return await this.usersRepository.deleteRtHash(logOutDto);
  }

  async refreshTokens(userId: string, rt: string): Promise<Tokens> {
    const user = await this.usersRepository.findOneById(userId);
    if (!user) throw new ForbiddenException();

    const rtMatches = await this.securityService.compareData(rt, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException();

    const tokens = await this.securityService.signTokens(
      user.id,
      user.email,
      user.role,
    );
    await this.usersRepository.updateRtHash(user.id, tokens.refreshToken);

    return tokens;
  }
}
