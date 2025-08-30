import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { PostsService } from './posts.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [AuthModule, UserModule, PostsModule],
  controllers: [PostsController],
  providers: [PostsService, PrismaService],
})
export class PostsModule {}


