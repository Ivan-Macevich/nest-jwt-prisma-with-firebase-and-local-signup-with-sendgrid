import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ErrorCodes } from '@common/enums/error-codes.enum';

export class RefreshTokenDto {
  @ApiProperty({ description: 'User ID' })
  @IsString({ message: ErrorCodes.FieldShouldBeString })
  @IsNotEmpty({ message: ErrorCodes.FieldShouldNotBeEmpty })
  userId: string;

  @ApiProperty({ description: 'Refresh token' })
  @IsString({ message: ErrorCodes.FieldShouldBeString })
  @IsNotEmpty({ message: ErrorCodes.FieldShouldNotBeEmpty })
  refreshToken: string;
}
