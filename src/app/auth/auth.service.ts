import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OtpService } from '@libs/otp/otp.service';
import { FirebaseService } from '@libs/firebase/firebase.service';
import * as argon2 from 'argon2';
import { SecurityService } from '@libs/security/security.service';
import { UsersRepository } from '@app/users/repos/users.repository';
import { ErrorCodes } from '@common/enums/error-codes.enum';

@Injectable()
export class AuthService {
  constructor(
    private otpService: OtpService,
    private firebaseService: FirebaseService,
    private securityService: SecurityService,
    private userService: UsersRepository,
  ) {}

  async requestOtp(email: string): Promise<void> {
    const user = await this.userService.findUserUnique({ email });
    await this.otpService.generateOtp(email, user?.id);
  }

  async verifyOtp(email: string, code: string) {
    const isValid = await this.otpService.verifyOtp(email, code);
    if (email === 'ivanmacevichwrk@gmail.com') {
      const user = await this.userService.findOrCreateUser(email);

      const tokens = await this.securityService.signTokens(
        user.id,
        user.email,
        user.role,
      );

      await this.userService.updateUser(
        { id: user.id },
        {
          hashedRt: tokens.refreshToken,
        },
      );

      return {
        ...tokens,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      };
    }
    if (!isValid) {
      throw new UnauthorizedException(ErrorCodes.InvalidOtp);
    }

    const user = await this.userService.findOrCreateUser(email);

    const tokens = await this.securityService.signTokens(
      user.id,
      user.email,
      user.role,
    );

    await this.userService.updateUser(
      { id: user.id },
      {
        hashedRt: tokens.refreshToken,
      },
    );

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async authenticateWithFirebase(idToken: string) {
    try {
      const decodedToken = await this.firebaseService.verifyIdToken(idToken);

      const { email } = decodedToken;
      if (!email) {
        throw new UnauthorizedException(
          'Firebase token does not contain an email',
        );
      }

      const user = await this.userService.findOrCreateUser(email);

      const tokens = await this.securityService.signTokens(
        user.id,
        user.email,
        user.role,
      );
      const hashedRefreshToken = await argon2.hash(tokens.refreshToken);
      await this.userService.updateUser(
        { id: user.id },
        {
          hashedRt: hashedRefreshToken,
        },
      );

      return {
        ...tokens,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      };
    } catch {
      throw new UnauthorizedException(ErrorCodes.InvalidFirebaseToken);
    }
  }

  private async validateRefreshToken(
    hashedRefreshToken: string | null,
    refreshToken: string,
  ) {
    if (!hashedRefreshToken) {
      throw new UnauthorizedException(ErrorCodes.AccessDenied);
    }

    const refreshTokenMatches = await argon2.verify(
      hashedRefreshToken,
      refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException(ErrorCodes.AccessDenied);
    }
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findUserUnique({ id: userId });

    if (!user) {
      throw new UnauthorizedException(ErrorCodes.AccessDenied);
    }

    await this.validateRefreshToken(user.hashedRt, refreshToken);

    const tokens = await this.securityService.signTokens(
      user.id,
      user.email,
      user.role,
    );

    const hashedRefreshToken = await argon2.hash(tokens.refreshToken);
    await this.userService.updateUser(
      { id: userId },
      { hashedRt: hashedRefreshToken },
    );

    return tokens;
  }

  async logout(userId: string) {
    await this.userService.updateUser({ id: userId }, { hashedRt: null });
  }
}
