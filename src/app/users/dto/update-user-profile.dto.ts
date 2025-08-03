import { ApiProperty } from '@nestjs/swagger';
import { Gender, InteractionFrequency, PrimaryGoal } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, Min, Max } from 'class-validator';

export class UpdateUserProfileDto {
  @ApiProperty({
    enum: Gender,
    description: 'Gender of the user',
    example: Gender.MALE,
    required: false,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({
    description: 'Age of the user',
    minimum: 13,
    maximum: 120,
    example: 25,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(13)
  @Max(120)
  age?: number;

  @ApiProperty({
    enum: PrimaryGoal,
    description: 'Main goal of the user',
    example: PrimaryGoal.CALM_DOWN,
    required: false,
  })
  @IsOptional()
  @IsEnum(PrimaryGoal)
  primaryGoal?: PrimaryGoal;

  @ApiProperty({
    enum: InteractionFrequency,
    description: 'Desired frequency of interaction with the application',
    example: InteractionFrequency.DAILY,
    required: false,
  })
  @IsOptional()
  @IsEnum(InteractionFrequency)
  interactionFreq?: InteractionFrequency;
}
