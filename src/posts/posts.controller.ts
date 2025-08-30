import {
    Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UploadedFile, UseInterceptors
  } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

  
  @Controller('posts')
  export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    /**
     * POST /posts/with-image
     * 
     * @description Create a post with optional image upload.
     * 
     * @headers Authorization: Bearer <JWT>
     * 
     * @form-data
     *   - title: string
     *   - content: string
     *   - published: string ("true" or "false")
     *   - image: file (.jpg/.png)
     * @response 201 Created
    */
    @UseGuards(JwtAuthGuard)
    @Post('with-image')
    @UseInterceptors(
      FileInterceptor('image', {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
          },
        }),
      }),
    )
    async createWithImage(
      @UploadedFile() file: Express.Multer.File,
      @Body() dto: CreatePostDto,
      @User() user: any
    ) {
      const published = String(dto.published) === 'true' || dto.published === true ? true : false;
      const imageUrl = file ? `/uploads/${file.filename}` : null;
      return this.postsService.create({ ...dto, image: imageUrl, published }, user.userId);
    }  
  
    /**
     * POST /posts
     * 
     * @description Create a new post (no image).
     * 
     * @headers Authorization: Bearer <JWT>
     * 
     * @body {
     *   "title": "Post title",
     *   "content": "Post content",
     *   "published": true
     * }
     * @response 201 Created
    */
    @UseGuards(JwtAuthGuard)
    @Post()
    create(
      @Body() dto: CreatePostDto, 
      @User() user: any
    ) {
      return this.postsService.create(dto, user.userId);
    }
  
    /**
     * GET /posts
     * 
     * @description Get all posts (public).
     * 
     * @response 200 OK
    */
    @Get()
    findAll() {
      return this.postsService.findAll();
    }
  
    /**
     * GET /posts/:id
     * 
     * @description Get a post by ID.
     * 
     * @param id - post UUID
     * 
     * @response 200 OK
     */
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.postsService.findOne(id);
    }
  
    /**
     * PATCH /posts/with-image/:id
     * 
     * @description Update a post and optionally replace the image.
     * 
     * @headers Authorization: Bearer <JWT>
     * 
     * @form-data
     *   - title: string (optional)
     *   - content: string (optional)
     *   - published: string ("true"/"false")
     *   - image: file (optional)
     * @param id - post UUID
     * 
     * @response 200 OK
    */
    @UseGuards(JwtAuthGuard)
    @Patch('with-image/:id') 
    @UseInterceptors(
      FileInterceptor('image', {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
            cb(null, uniqueName);
          },
        }),
      }),
    )
    async updateWithImage(
      @Param('id') id: string,
      @Body() dto: UpdatePostDto,
      @UploadedFile() file: Express.Multer.File,
      @User() user: any,
    ) {
      const published = String(dto.published) === 'true' || dto.published === true ? true : false;
      const imagePath = file ? `/uploads/${file.filename}` : undefined;

      return this.postsService.update(id, {
        ...dto,
        published,
        image: imagePath, 
      }, user.userId);
    }

    // PATCH /posts/:id
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
      @Param('id') id: string, 
      @Body() dto: UpdatePostDto, 
      @User() user: any
    ) {
      return this.postsService.update(id, dto, user.userId);
    }
  
    // DELETE /posts/:id
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(
      @Param('id') id: string, 
      @User() user: any
    ) {
      return this.postsService.delete(id, user.userId);
    }
  }
  