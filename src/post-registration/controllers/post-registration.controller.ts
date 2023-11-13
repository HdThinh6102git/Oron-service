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
import { PostRegistrationService } from '../providers';
import { JwtAuthGuard } from '../../auth/guards';
import { ReqContext, RequestContext } from '../../shared/request-context';
import { BaseApiResponse, BasePaginationResponse } from '../../shared/dtos';
import {
  CreatePostRegistrationInput,
  PostRegistrationFilter,
  PostRegistrationOutput,
  UpdatePostRegistrationInput,
} from '../dtos';

@Controller('post-registration')
export class PostRegistrationController {
  constructor(private postRegistrationService: PostRegistrationService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  public async createNewPostRegistration(
    @ReqContext() ctx: RequestContext,
    @Body() body: CreatePostRegistrationInput,
  ): Promise<BaseApiResponse<PostRegistrationOutput>> {
    return await this.postRegistrationService.createNewPostRegistration(
      body,
      ctx.user.id,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  public async updatePostRegistration(
    @Param('id') postRegistrationId: string,
    @Body() body: UpdatePostRegistrationInput,
  ): Promise<BaseApiResponse<PostRegistrationOutput>> {
    return await this.postRegistrationService.updatePostRegistration(
      body,
      postRegistrationId,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  public async deletePostRegistration(
    @ReqContext() ctx: RequestContext,
    @Param('id') postRegistrationId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.postRegistrationService.deletePostRegistration(
      postRegistrationId,
      ctx.user.id,
    );
  }

  @Get('/filter')
  @UseGuards(JwtAuthGuard)
  public async getPostRegistrations(
    @Query() query: PostRegistrationFilter,
  ): Promise<BasePaginationResponse<PostRegistrationOutput>> {
    return this.postRegistrationService.getPostRegistrations(query);
  }
}
