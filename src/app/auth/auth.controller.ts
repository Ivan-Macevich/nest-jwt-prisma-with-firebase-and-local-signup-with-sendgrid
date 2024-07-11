import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '@app/auth/auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { Tokens } from 'common/types/tokens.type';
import { SignInDto } from './dto/sign-in.dto';
import { JwtPayload } from '@common/types/jwt-payload.type';
import { GetCurrentUser } from '@libs/security/decorators/get-current-user.decorator';
import { Public } from '@libs/security/decorators/public.decorator';
import { RefreshTokenStrategy } from '@libs/security/guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  signUpLocal(@Body() signUpDto: SignUpDto): Promise<Tokens> {
    return this.authService.signUpLocal(signUpDto);
  }

  @Public()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  signInLocal(@Body() signInDto: SignInDto): Promise<Tokens> {
    return this.authService.signInLocal(signInDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logOut(@GetCurrentUser() user: JwtPayload): void {
    console.log(user);
  }

  @Public()
  @UseGuards(RefreshTokenStrategy)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens() {}
}
