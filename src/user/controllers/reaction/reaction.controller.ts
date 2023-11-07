import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReactionService } from '../../providers';
import { JwtAuthGuard } from '../../../auth/guards';
import { ReqContext, RequestContext } from '../../../shared/request-context';
import { BaseApiResponse, BasePaginationResponse } from '../../../shared/dtos';
import {
  CreateReactionInput,
  ReactionFilter,
  ReactionOutput,
} from '../../dtos';

@Controller('reaction')
export class ReactionController {
  constructor(private reactionService: ReactionService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  public async createNewReaction(
    @ReqContext() ctx: RequestContext,
    @Body() body: CreateReactionInput,
  ): Promise<BaseApiResponse<ReactionOutput>> {
    return await this.reactionService.createNewReaction(body, ctx.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  public async deleteReaction(
    @Param('id') reactionId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.reactionService.deleteReaction(reactionId);
  }

  @Get('/post/:postId')
  public async getReactionsByPostId(
    @Param('postId') postId: string,
    @Query() query: ReactionFilter,
  ): Promise<BasePaginationResponse<ReactionOutput>> {
    return await this.reactionService.getReactionsByPostId(postId, query);
  }
}
