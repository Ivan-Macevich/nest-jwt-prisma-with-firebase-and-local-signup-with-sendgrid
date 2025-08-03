import { IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { ErrorCodes } from '@common/enums/error-codes.enum';
export class RequestOtpDto {
  @ApiProperty({
    description: 'Email address',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: ErrorCodes.FieldShouldBeEmail })
  @IsNotEmpty({ message: ErrorCodes.FieldShouldNotBeEmpty })
  email: string;
}
