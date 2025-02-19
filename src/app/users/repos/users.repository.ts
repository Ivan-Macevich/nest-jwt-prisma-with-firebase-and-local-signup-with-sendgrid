import { PrismaService } from '@libs/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOneById(id: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findOneByPhone(phoneNumber: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        phoneNumber,
      },
    });
  }

  async createUser(data: Partial<User>): Promise<User> {
    return this.prisma.user.create({
      data: {
        verified: false,
        email: data.email || '',
        phoneNumber: data.phoneNumber || '',
        fullName: data.fullName || '',
      },
    });
  }

  async updateRtHash(userId: string, hashedRt: string): Promise<User> {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hashedRt,
      },
    });
  }

  async deleteRtHash(user: Pick<User, 'id'>): Promise<User> {
    return await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        hashedRt: null,
      },
    });
  }

  async updateEmailToken(
    user: Pick<User, 'email' | 'emailToken'>,
  ): Promise<User> {
    console.log(user.email);
    return await this.prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        emailToken: user.emailToken,
      },
    });
  }

  async verifyUser(user: Pick<User, 'email'>): Promise<User> {
    return await this.prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        verified: true,
      },
    });
  }
}
