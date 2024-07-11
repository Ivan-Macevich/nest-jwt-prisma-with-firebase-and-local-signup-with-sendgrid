import { UuidErrorMessage } from '@libs/exceptions/i18n-errors';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class LogOutDto {
  @ApiProperty({ description: 'userId' })
  @IsUUID(undefined, { message: UuidErrorMessage })
  id: string;
}
