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
import { ReviewService } from '../../providers';
import { JwtAuthGuard } from '../../../auth/guards';
import { ReqContext, RequestContext } from '../../../shared/request-context';
import { BaseApiResponse, BasePaginationResponse } from '../../../shared/dtos';
import {
  CreateReviewInput,
  ReviewFilter,
  ReviewOutput,
  UpdateReviewInput,
} from '../../dtos';

@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  public async createNewReview(
    @ReqContext() ctx: RequestContext,
    @Body() body: CreateReviewInput,
  ): Promise<BaseApiResponse<ReviewOutput>> {
    return await this.reviewService.createNewReview(body, ctx.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  public async updateReview(
    @Param('id') reviewId: string,
    @Body() body: UpdateReviewInput,
  ): Promise<BaseApiResponse<ReviewOutput>> {
    return await this.reviewService.updateReview(body, reviewId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  public async deleteReview(
    @ReqContext() ctx: RequestContext,
    @Param('id') reviewId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.reviewService.deleteReview(reviewId, ctx.user.id);
  }

  @Get('/filter')
  public async getReviews(
    @Query() query: ReviewFilter,
  ): Promise<BasePaginationResponse<ReviewOutput>> {
    return this.reviewService.getReviews(query);
  }
}
