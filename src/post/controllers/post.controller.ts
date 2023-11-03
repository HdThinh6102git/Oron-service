import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from '../providers';
import { BaseApiResponse, BasePaginationResponse } from '../../shared/dtos';
import {
  CreatePostInput,
  PostFilter,
  PostOutput,
  UpdatePostInput,
} from '../dtos';
import { JwtAuthGuard } from '../../auth/guards';
import { ReqContext, RequestContext } from '../../shared/request-context';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  public async createNewPost(
    @ReqContext() ctx: RequestContext,
    @Body() body: CreatePostInput,
  ): Promise<BaseApiResponse<PostOutput>> {
    return await this.postService.createNewPost(body, ctx.user.id);
  }

  @Patch(':id')
  public async updatePost(
    @Param('id') postId: string,
    @Body() body: UpdatePostInput,
  ): Promise<BaseApiResponse<PostOutput>> {
    return await this.postService.updatePost(body, postId);
  }

  @Get('/filter')
  public async getAllPosts(
    @Query() query: PostFilter,
  ): Promise<BasePaginationResponse<PostOutput>> {
    return this.postService.getAllPosts(query);
  }

  @Get(':id')
  public async getPostById(
    @Param('id') postId: string,
  ): Promise<BaseApiResponse<PostOutput>> {
    return await this.postService.getPostById(postId);
  }
}
