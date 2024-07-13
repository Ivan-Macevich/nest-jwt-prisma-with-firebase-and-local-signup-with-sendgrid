import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '@libs/prisma/prisma.service';
import { UsersRepository } from './repos/users.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, UsersRepository],
  exports: [UsersRepository, UsersService],
})
export class UsersModule {}
