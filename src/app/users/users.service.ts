import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { UsersRepository } from './repos/users.repository';
import { ONBOARDING_STEPS } from './consts/onboarding.const';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import {
  OnboardingStatusDto,
  OnboardingStepResponseDto,
  PrivacyConsentDto,
} from './dto/onboarding';

@Injectable()
export class UsersService {
  constructor(private userRepository: UsersRepository) {}

  async findUserUnique(data: Prisma.UserWhereUniqueInput) {
    const user = await this.userRepository.findUserUnique(data);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, updateData: UpdateUserProfileDto) {
    await this.findUserUnique({ id: userId });

    return await this.userRepository.updateUser({ id: userId }, updateData);
  }

  // Методы онбординга
  async updateUserOnboardingData(
    userId: string,
    userData: UpdateUserProfileDto,
  ): Promise<OnboardingStepResponseDto> {
    await this.userRepository.updateUser(
      { id: userId },
      {
        gender: userData.gender,
        age: userData.age,
        primaryGoal: userData.primaryGoal,
        interactionFreq: userData.interactionFreq,
      },
    );

    return {
      currentStep: 1,
      totalSteps: ONBOARDING_STEPS,
      isCompleted: false,
    };
  }

  async updatePrivacyConsent(
    userId: string,
    consent: PrivacyConsentDto,
  ): Promise<OnboardingStepResponseDto> {
    await this.findUserUnique({ id: userId });

    await this.userRepository.updateUser(
      { id: userId },
      {
        privacyConsent: consent.privacyConsent,
      },
    );

    return {
      currentStep: 2,
      totalSteps: ONBOARDING_STEPS,
      isCompleted: false,
    };
  }

  async completeOnboarding(userId: string) {
    return await this.userRepository.updateUser(
      { id: userId },
      {
        onboardingCompleted: true,
      },
    );
  }

  async getOnboardingStatus(userId: string): Promise<OnboardingStatusDto> {
    const user = await this.findUserUnique({ id: userId });

    return {
      onboardingCompleted: user.onboardingCompleted,
      gender: user.gender,
      age: user.age,
      primaryGoal: user.primaryGoal,
      interactionFreq: user.interactionFreq,
      privacyConsent: user.privacyConsent,
    };
  }
}
