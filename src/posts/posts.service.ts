import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreatePostDto, authorId: string) {
    return this.prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        published: data.published ?? false,
        image: data.image ?? null,  
        authorId,
      },
    });
  }
  
  findAll() {
    return this.prisma.post.findMany({
      where: { published: true },
      include: { author: true },
    });
  }

  findOne(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  async update(id: string, data: UpdatePostDto, authorId: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
  
    if (!post || post.authorId !== authorId) {
      throw new Error('Unauthorized or post not found');
    }
  
    return this.prisma.post.update({
      where: { id },
      data: {
        title: data.title ?? post.title,
        content: data.content ?? post.content,
        published: data.published ?? post.published,
        image: data.image ?? post.image, 
      },
    });
  }

  delete(id: string, authorId: string) {
    return this.prisma.post.deleteMany({
      where: { id, authorId },
    });
  }
}
