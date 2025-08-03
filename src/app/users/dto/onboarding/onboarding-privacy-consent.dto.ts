import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class PrivacyConsentDto {
  @ApiProperty({
    description: 'Privacy consent',
    example: true,
  })
  @IsBoolean()
  privacyConsent: boolean;
}
