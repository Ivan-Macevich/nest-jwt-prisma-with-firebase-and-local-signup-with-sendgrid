import {
  EmailErrorMessage,
  StringErrorMessage,
} from '@libs/exceptions/i18n-errors';
import { IsEmail, IsString, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    required: true,
  })
  @IsEmail(undefined, { message: EmailErrorMessage })
  email!: string;

  @ApiProperty({
    description: 'User full name',
    example: 'Doe Carson',
    required: true,
  })
  @IsString({ message: StringErrorMessage })
  fullName!: string;

  @ApiProperty({
    description: 'Phone number in E.164 format',
    example: '+14155552671',
    required: true,
  })
  @IsPhoneNumber()
  phoneNumber!: string;
}
