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
import { CommentService } from '../../providers/comment';
import { JwtAuthGuard } from '../../../auth/guards';
import { ReqContext, RequestContext } from '../../../shared/request-context';
import { BaseApiResponse, BasePaginationResponse } from '../../../shared/dtos';
import {
  CommentFilter,
  CommentOutput,
  CreateCommentInput,
  UpdateCommentInput,
} from '../../dtos';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  public async createNewComment(
    @ReqContext() ctx: RequestContext,
    @Body() body: CreateCommentInput,
  ): Promise<BaseApiResponse<CommentOutput>> {
    return await this.commentService.createNewComment(body, ctx.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  public async updateComment(
    @Param('id') commentId: string,
    @Body() body: UpdateCommentInput,
  ): Promise<BaseApiResponse<CommentOutput>> {
    return await this.commentService.updateComment(body, commentId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  public async deleteComment(
    @ReqContext() ctx: RequestContext,
    @Param('id') commentId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.commentService.deleteComment(commentId, ctx.user.id);
  }

  @Get('/filter')
  public async getAllComments(
    @Query() query: CommentFilter,
  ): Promise<BasePaginationResponse<CommentOutput>> {
    return this.commentService.getAllComments(query);
  }

  @Get('/post/:postId')
  public async getRootCommentsByPostId(
    @Param('postId') postId: string,
    @Query() query: CommentFilter,
  ): Promise<BasePaginationResponse<CommentOutput>> {
    return await this.commentService.getRootCommentsByPostId(postId, query);
  }

  @Get('/parent/:parentId')
  public async getChildCommentsByCommentId(
    @Param('parentId') parentId: string,
    @Query() query: CommentFilter,
  ): Promise<BasePaginationResponse<CommentOutput>> {
    return await this.commentService.getChildCommentsByCommentId(parentId, query);
  }

  @Get('/post/:postId/user')
  @UseGuards(JwtAuthGuard)
  public async getUserCommentsOnPost(
    @Param('postId') postId: string,
    @Query() query: CommentFilter,
    @ReqContext() ctx: RequestContext,
  ): Promise<BasePaginationResponse<CommentOutput>> {
    return await this.commentService.getUserCommentsOnPost(
      postId,
      query,
      ctx.user.id,
    );
  }
}
