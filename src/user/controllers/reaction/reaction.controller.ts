import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReactionService } from '../../providers';
import { JwtAuthGuard } from '../../../auth/guards';
import { ReqContext, RequestContext } from '../../../shared/request-context';
import { BaseApiResponse } from '../../../shared/dtos';
import { CreateReactionInput, ReactionOutput } from '../../dtos';

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
}
