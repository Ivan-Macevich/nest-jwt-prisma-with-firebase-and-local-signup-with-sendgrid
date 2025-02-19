import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsPhoneNumber, Matches } from 'class-validator';

export class SendVerificationDto {
  @ApiProperty({
    example: '+12345678900',
    description: 'Phone number in E.164 format (e.g., +12345678900)',
    format: 'E.164',
  })
  @IsString()
  @IsPhoneNumber()
  @Matches(/^\+[1-9]\d{10,14}$/, {
    message: 'Phone number must be in E.164 format (e.g., +12345678900)',
  })
  phoneNumber: string;
}
