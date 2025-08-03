import { ApiProperty } from '@nestjs/swagger';

export class OnboardingStepResponseDto {
  @ApiProperty({
    description: 'Current onboarding step number',
    example: 2,
  })
  currentStep: number;

  @ApiProperty({
    description: 'Total number of steps',
    example: 4,
  })
  totalSteps: number;

  @ApiProperty({
    description: 'Onboarding completion status',
    example: false,
  })
  isCompleted: boolean;
}
