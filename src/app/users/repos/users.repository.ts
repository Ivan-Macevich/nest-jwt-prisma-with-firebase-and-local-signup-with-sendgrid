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

  async findOneByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        email,
        password,
      },
    });
  }

  async createUser(
    user: Pick<
      User,
      'role' | 'gender' | 'email' | 'name' | 'lastName' | 'password'
    >,
  ): Promise<User> {
    return await this.prisma.user.create({
      data: {
        role: user.role,
        gender: user.gender,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        password: user.password,
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
}
