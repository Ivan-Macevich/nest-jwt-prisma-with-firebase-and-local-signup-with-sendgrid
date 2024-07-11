import {
  EmailErrorMessage,
  StrongPasswordErrorMessage,
} from '@libs/exceptions/i18n-errors';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'User email',
    type: 'email',
    example: 'john.doe@example.com',
  })
  @IsEmail(undefined, { message: EmailErrorMessage })
  email!: string;

  @ApiProperty({
    description: 'User password',
    type: 'string',
    example: 'Password123!',
  })
  @IsStrongPassword(undefined, { message: StrongPasswordErrorMessage })
  password!: string;
}
