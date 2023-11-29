import {
  Body,
  Controller,
  Delete,
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
  SavedPostOutput,
  UpdatePostInput,
} from '../dtos';
import { JwtAuthGuard } from '../../auth/guards';
import { ReqContext, RequestContext } from '../../shared/request-context';
import { SavedPostFilter } from '../dtos/saved-post-filter.dto';

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
  public async getPosts(
    @Query() query: PostFilter,
  ): Promise<BasePaginationResponse<PostOutput>> {
    return this.postService.getPosts(query);
  }

  @Get(':id')
  public async getPostById(
    @Param('id') postId: string,
  ): Promise<BaseApiResponse<PostOutput>> {
    return await this.postService.getPostById(postId);
  }

  @Delete('permanently/:id')
  @UseGuards(JwtAuthGuard)
  public async deletePostPermanently(
    @Param('id') postId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.postService.deletePostPermanently(postId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  public async deletePost(
    @Param('id') postId: string,
    @ReqContext() ctx: RequestContext,
  ): Promise<BaseApiResponse<null>> {
    return this.postService.deletePost(postId, ctx.user.id);
  }

  @Patch('restoration/:id')
  public async retorePost(
    @Param('id') postId: string,
  ): Promise<BaseApiResponse<PostOutput>> {
    return await this.postService.restorePost(postId);
  }

  @Post(':id/save')
  @UseGuards(JwtAuthGuard)
  public async savePost(
    @ReqContext() ctx: RequestContext,
    @Param('id') postId: string,
  ): Promise<BaseApiResponse<SavedPostOutput>> {
    return await this.postService.savePost(ctx.user.id, postId);
  }

  @Delete(':id/unsave')
  @UseGuards(JwtAuthGuard)
  public async unSavePost(
    @ReqContext() ctx: RequestContext,
    @Param('id') postId: string,
  ): Promise<BaseApiResponse<null>> {
    return await this.postService.unSavePost(ctx.user.id, postId);
  }

  @Get('saved/user')
  @UseGuards(JwtAuthGuard)
  public async getSavedPostsByUserId(
    @ReqContext() ctx: RequestContext,
    @Query() query: SavedPostFilter,
  ): Promise<BasePaginationResponse<PostOutput>> {
    return await this.postService.getSavedPostsByUserId(ctx.user.id, query);
  }
}
