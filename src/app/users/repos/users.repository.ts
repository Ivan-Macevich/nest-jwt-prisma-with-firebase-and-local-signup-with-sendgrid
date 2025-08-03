import { PrismaService } from '@libs/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserUnique(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({ where });
  }

  async findOrCreateUser(email: string, defaultData?: Prisma.UserCreateInput) {
    const existingUser = await this.findUserUnique({ email });
    if (existingUser) {
      return existingUser;
    }

    const userData = {
      email,
      fullName: defaultData?.fullName || email.split('@')[0] || 'User',
      ...defaultData,
    };

    return this.createUser(userData);
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async updateUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.prisma.user.update({ where, data });
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
