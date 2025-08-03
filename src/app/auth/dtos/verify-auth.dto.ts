import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ErrorCodes } from '@common/enums/error-codes.enum';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Email address',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: ErrorCodes.FieldShouldBeEmail })
  @IsNotEmpty({ message: ErrorCodes.FieldShouldNotBeEmpty })
  email: string;

  @ApiProperty({
    description: 'OTP code',
    example: '123456',
  })
  @IsString({ message: ErrorCodes.FieldShouldBeString })
  @IsNotEmpty({ message: ErrorCodes.FieldShouldNotBeEmpty })
  @Length(6, 6)
  code: string;
}
