import {
  EmailErrorMessage,
  EnumErrorMessage,
  StringErrorMessage,
  StrongPasswordErrorMessage,
} from '@libs/exceptions/i18n-errors';
import { IsEmail, IsEnum, IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';

export class SignUpDto {
  @ApiProperty({
    description: 'email',
  })
  @IsEmail(undefined, { message: EmailErrorMessage })
  email!: string;

  @ApiProperty({
    description: 'password',
  })
  @IsStrongPassword(undefined, { message: StrongPasswordErrorMessage })
  password!: string;

  @ApiProperty({
    description: 'password confirm',
  })
  @IsStrongPassword(undefined, { message: StrongPasswordErrorMessage })
  password_confirm!: string;

  @ApiProperty({
    description: 'gender',
  })
  @IsEnum(Gender, { message: EnumErrorMessage })
  gender!: Gender;

  @ApiProperty({
    description: 'lastName',
  })
  @IsString({ message: StringErrorMessage })
  lastName!: string;

  @ApiProperty({
    description: 'name',
  })
  @IsString({ message: StringErrorMessage })
  name!: string;
}
