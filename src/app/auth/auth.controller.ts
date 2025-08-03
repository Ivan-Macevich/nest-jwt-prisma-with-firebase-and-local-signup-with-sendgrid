import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from '@libs/security/decorators/public.decorator';
import { AuthenticatedRequest } from './types/auth-request';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { FirebaseAuthDto } from './dtos/firebase-auth.dto';
import { VerifyOtpDto } from './dtos/verify-auth.dto';
import { RequestOtpDto } from './dtos/request-otp.dto';

@ApiTags('Authentication - V1')
@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('request-otp')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Request OTP code for authentication' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  async requestOtp(@Body() dto: RequestOtpDto) {
    await this.authService.requestOtp(dto.email);
  }

  @Public()
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP code for admin' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  async verifyOtpAdmin(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto.email, dto.code);
  }

  @Public()
  @Post('firebase')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Authenticate with Firebase (Google/Apple) for admin',
  })
  @ApiResponse({ status: 200, description: 'Authentication successful' })
  async firebaseAuthAdmin(@Body() dto: FirebaseAuthDto) {
    return this.authService.authenticateWithFirebase(dto.idToken);
  }

  @Public()
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh token for admin' })
  @ApiResponse({ status: 200, description: 'Refresh token successful' })
  async refreshTokenAdmin(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.userId, dto.refreshToken);
  }

  @Delete('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Logout admin' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@Req() req: AuthenticatedRequest) {
    await this.authService.logout(req?.user?.userId);
  }
}
