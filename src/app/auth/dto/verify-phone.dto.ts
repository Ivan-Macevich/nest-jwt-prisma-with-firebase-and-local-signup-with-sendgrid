import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString, Length } from 'class-validator';

export class VerifyPhoneDto {
  @ApiProperty({
    description: 'Phone number in E.164 format',
    example: '+14155552671',
  })
  @IsPhoneNumber()
  phoneNumber!: string;

  @ApiProperty({
    description: 'Verification code',
    example: '123456',
  })
  @IsString()
  @Length(6, 6)
  code!: string;
}
