import { SecurityService } from '@libs/security/security.service';
import { UsersRepository } from '@app/users/repos/users.repository';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Tokens } from '@common/types/tokens.type';
import { SignUpDto } from '@app/auth/dto/sign-up.dto';
import { Role } from '@common/enums/role.enum';
import { SignInDto } from './dto/sign-in.dto';
import { LogOutDto } from './dto/log-out.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private securityService: SecurityService,
  ) {}

  async signUpLocal(signUpDto: SignUpDto): Promise<Tokens> {
    const user = await this.usersRepository.createUser({
      role: Role.Parent,
      gender: signUpDto.gender,
      email: signUpDto.email,
      name: signUpDto.name,
      lastName: signUpDto.lastName,
      password: await this.securityService.hashData(signUpDto.password),
    });

    const tokens = await this.securityService.signTokens(
      user.id,
      user.email,
      user.role,
    );
    await this.securityService.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async signInLocal(signInDto: SignInDto): Promise<Tokens> {
    const user = await this.usersRepository.findOneByEmail(signInDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await this.securityService.compareData(
      signInDto.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.securityService.signTokens(
      user.id,
      user.email,
      user.role,
    );
    await this.securityService.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async logOut(logOutDto: LogOutDto): Promise<User> {
    return await this.usersRepository.deleteRtHash(logOutDto);
  }

  async refreshTokens(userId: string, rt: string): Promise<Tokens> {
    const user = await this.usersRepository.findOneById(userId);
    if (!user) throw new ForbiddenException();

    const rtMatches = await this.securityService.compareData(rt, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException();

    const tokens = await this.securityService.signTokens(
      user.id,
      user.email,
      user.role,
    );
    await this.usersRepository.updateRtHash(user.id, tokens.refreshToken);

    return tokens;
  }
}
