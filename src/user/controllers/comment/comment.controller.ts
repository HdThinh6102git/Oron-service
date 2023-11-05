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
    @Param('id') commentId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.commentService.deleteComment(commentId);
  }

  @Get('/filter')
  public async getAllComments(
    @Query() query: CommentFilter,
  ): Promise<BasePaginationResponse<CommentOutput>> {
    return this.commentService.getAllComments(query);
  }
}
