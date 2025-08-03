import { ErrorCodes } from '@common/enums/error-codes.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class FirebaseAuthDto {
  @ApiProperty({
    description: 'Firebase ID token from Google or Apple Sign-In',
    example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjFlOWdkazcifQ...',
  })
  @IsString({ message: ErrorCodes.FieldShouldBeString })
  @IsNotEmpty({ message: ErrorCodes.FieldShouldNotBeEmpty })
  idToken: string;
}
