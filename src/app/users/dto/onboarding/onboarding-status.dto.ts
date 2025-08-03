import { ApiProperty } from '@nestjs/swagger';
import { Gender, InteractionFrequency, PrimaryGoal } from '@prisma/client';

export class OnboardingStatusDto {
  @ApiProperty({
    description: 'Onboarding completion status',
    example: true,
  })
  onboardingCompleted: boolean;

  @ApiProperty({
    enum: Gender,
    description: 'Gender of the user',
    example: Gender.MALE,
    required: false,
  })
  gender?: Gender;

  @ApiProperty({
    description: 'Age of the user',
    example: 25,
    required: false,
  })
  age?: number;

  @ApiProperty({
    enum: PrimaryGoal,
    description: 'Main goal of the user',
    example: PrimaryGoal.CALM_DOWN,
    required: false,
  })
  primaryGoal?: PrimaryGoal;

  @ApiProperty({
    enum: InteractionFrequency,
    description: 'Desired frequency of interaction with the application',
    example: InteractionFrequency.DAILY,
    required: false,
  })
  interactionFreq?: InteractionFrequency;

  @ApiProperty({
    description: 'Privacy consent',
    example: true,
  })
  privacyConsent: boolean;
}
