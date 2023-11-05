import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from '../../providers/comment';
import { JwtAuthGuard } from '../../../auth/guards';
import { ReqContext, RequestContext } from '../../../shared/request-context';
import { BaseApiResponse } from '../../../shared/dtos';
import {
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
  public async updateComment(
    @Param('id') commentId: string,
    @Body() body: UpdateCommentInput,
  ): Promise<BaseApiResponse<CommentOutput>> {
    return await this.commentService.updateComment(body, commentId);
  }
}
