import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { AuthService } from '@app/auth/auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { Tokens } from 'common/types/tokens.type';
import { SignInDto } from './dto/sign-in.dto';
import { JwtPayload } from '@common/types/jwt-payload.type';
import { GetCurrentUser } from '@libs/security/decorators/get-current-user.decorator';
import { Public } from '@libs/security/decorators/public.decorator';
import { RefreshTokenStrategy } from '@libs/security/guards/refresh-token.guard';
import { Roles } from '@app/roles/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from '@libs/security/guards/roles.guard';
import { TwilioService } from '../../libs/twilio/twilio.service';
import { VerifyPhoneDto } from './dto/verify-phone.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SendVerificationDto } from './dto/send-verification.dto';
import { SendEmailDto } from './dto/send-email.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private twilioService: TwilioService,
  ) {}

  @Public()
  @Post('phone/send-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send verification code to phone number' })
  @ApiResponse({
    status: 200,
    description: 'Verification code sent successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to send verification code',
  })
  async sendVerificationCode(@Body() sendVerificationDto: SendVerificationDto) {
    // const sent = await this.twilioService.sendVerificationCode(
    //   sendVerificationDto.phoneNumber,
    // );

    // if (!sent) {
    //   throw new HttpException(
    //     'Failed to send verification code',
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }

    return {
      message: 'Verification code sent successfully',
      success: true,
    };
  }

  @Public()
  @Post('email/send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send verification email to user' })
  @ApiResponse({
    status: 200,
    description: 'Verification email sent successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to send verification email',
  })
  async sendVerificationEmail(@Body() sendVerificationEmailDto: SendEmailDto) {
    const sent = await this.twilioService.sendVerificationCode(
      sendVerificationEmailDto.email,
    );
    if (!sent) {
      throw new HttpException(
        'Failed to send verification code',
        HttpStatus.BAD_REQUEST,
      );
    }
    return { message: 'Verification code sent successfully' };
  }

  @Public()
  @Post('phone/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify phone number with code' })
  @ApiResponse({
    status: 200,
    description: 'Phone number verified successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid verification code',
  })
  async verifyPhoneNumber(@Body() verifyPhoneDto: VerifyPhoneDto) {
    // const verified = await this.twilioService.verifyCode(
    //   verifyPhoneDto.phoneNumber,
    //   verifyPhoneDto.code,
    // );
    // if (!verified) {
    //   throw new HttpException(
    //     'Invalid verification code',
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }
    return {
      message: 'Phone number verified successfully',
      success: true,
    };
  }

  @Public()
  @Post('email/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email with code' })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid verification code',
  })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    const verified = await this.twilioService.verifyCode(
      verifyEmailDto.email,
      verifyEmailDto.code,
    );
    if (!verified) {
      throw new HttpException(
        'Invalid verification code',
        HttpStatus.BAD_REQUEST,
      );
    }
    return { message: 'Email verified successfully' };
  }
  //#########################

  @Public()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: Tokens,
  })
  @ApiResponse({
    status: 400,
    description: 'Phone number not verified or validation error',
  })
  async signUpLocal(@Body() signUpDto: SignUpDto): Promise<Tokens> {
    const verified = await this.authService.isPhoneNumberRegistered(
      signUpDto.phoneNumber,
    );
    if (verified) {
      throw new HttpException(
        'Phone number already registered',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.authService.signUpLocal(signUpDto);
  }

  @Public()
  @Post('local/signin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: Tokens,
  })
  @ApiResponse({
    status: 400,
    description: 'Phone number not verified or validation error',
  })
  async signInLocal(@Body() signInDto: SignInDto): Promise<Tokens> {
    const registered = await this.authService.isPhoneNumberRegistered(
      signInDto.phoneNumber,
    );
    const verified = await this.twilioService.verifyCode(
      signInDto.phoneNumber,
      signInDto.code,
    );
    if (!registered || !verified) {
      throw new HttpException(
        'Phone number not verified or validation error',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.authService.logIn(signInDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged out',
  })
  logOut(@GetCurrentUser() user: JwtPayload): void {
    console.log(user);
  }

  @Public()
  @UseGuards(RefreshTokenStrategy)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Tokens successfully refreshed',
    type: Tokens,
  })
  refreshTokens() {}

  @Post('rolesecured')
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Role-secured endpoint example' })
  @ApiResponse({
    status: 200,
    description: 'Access granted',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient role',
  })
  roleSecured() {
    return { message: 'Access granted' };
  }
}
