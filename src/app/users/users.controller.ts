import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import {
  OnboardingStatusDto,
  OnboardingStepResponseDto,
  PrivacyConsentDto,
} from './dto/onboarding';
import { GetCurrentUser } from '@libs/security/decorators/get-current-user.decorator';
import { AuthUser } from '@common/interfaces/auth-user.interface';

@ApiTags('Users - V1')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Returns full user profile information',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile successfully received',
  })
  async getProfile(@GetCurrentUser() user: AuthUser) {
    return this.usersService.findUserUnique({ id: user.userId });
  }

  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update user profile',
    description: 'Updates user profile data',
  })
  @ApiResponse({
    status: 200,
    description: 'Профиль успешно обновлен',
  })
  async updateProfile(
    @GetCurrentUser() user: AuthUser,
    @Body() updateData: UpdateUserProfileDto,
  ) {
    return this.usersService.updateProfile(user.userId, updateData);
  }

  @Get('onboarding/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get onboarding status',
    description: 'Returns the current status of onboarding and saved data',
  })
  @ApiResponse({
    status: 200,
    description: 'Onboarding status successfully received',
    type: OnboardingStatusDto,
  })
  async getOnboardingStatus(
    @GetCurrentUser() user: AuthUser,
  ): Promise<OnboardingStatusDto> {
    return this.usersService.getOnboardingStatus(user.userId);
  }

  @Post('onboarding/user-data')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Save user data (onboarding step)',
    description:
      'Saves user data (gender, age, primary goal and interaction frequency)',
  })
  @ApiResponse({
    status: 200,
    description: 'Данные пользователя успешно сохранены',
    type: OnboardingStepResponseDto,
  })
  async updateOnboardingData(
    @GetCurrentUser() user: AuthUser,
    @Body() userData: UpdateUserProfileDto,
  ): Promise<OnboardingStepResponseDto> {
    return this.usersService.updateUserOnboardingData(user.userId, userData);
  }

  @Post('onboarding/privacy-consent')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Save privacy consent',
    description: 'Saves the user’s consent to the privacy policy',
  })
  @ApiResponse({
    status: 200,
    description: 'Privacy consent successfully saved',
    type: OnboardingStepResponseDto,
  })
  async updatePrivacyConsent(
    @GetCurrentUser() user: AuthUser,
    @Body() consent: PrivacyConsentDto,
  ): Promise<OnboardingStepResponseDto> {
    return this.usersService.updatePrivacyConsent(user.userId, consent);
  }

  @Post('onboarding/complete')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Onboarding successfully completed',
  })
  async completeOnboarding(@GetCurrentUser() user: AuthUser) {
    return this.usersService.completeOnboarding(user.userId);
  }
}
