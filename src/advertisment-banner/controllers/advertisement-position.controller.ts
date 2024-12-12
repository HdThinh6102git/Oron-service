import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdvertisementPositionService } from "@modules/advertisment-banner/providers";
import { JwtAdminAuthGuard, JwtAuthGuard, JwtCommonAuthGuard } from "@modules/auth/guards";
import { BaseApiResponse, BasePaginationResponse } from "@modules/shared/dtos";
import { AdvertisementPositionOutput, CreateAdvertisementPositionInput, PositionFilter, UpdateAdvertisementPositionInput, UserPositionFilter, UserPositionOutput } from "@modules/advertisment-banner/dtos";
import { ReqContext, RequestContext } from "@modules/shared/request-context";

@Controller('advertisement-position')
export class AdvertisementPositionController {
  constructor(private advertisementPositionService: AdvertisementPositionService) {}

  @Post()
  @UseGuards(JwtAdminAuthGuard)
  public async createNewPosition(
    @ReqContext() ctx: RequestContext,
    @Body() body: CreateAdvertisementPositionInput,
  ): Promise<BaseApiResponse<AdvertisementPositionOutput>> {
    return await this.advertisementPositionService.createNewPosition(ctx.user.id, body);
  }

  @Patch(':id')
  @UseGuards(JwtAdminAuthGuard)
  public async updatePosition(
    @ReqContext() ctx: RequestContext,
    @Param('id') positionId: string,
    @Body() body: UpdateAdvertisementPositionInput,
  ): Promise<BaseApiResponse<AdvertisementPositionOutput>> {
    return await this.advertisementPositionService.updatePosition(ctx.user.id,body, positionId);
  }

  @Get(':id')
  @UseGuards(JwtCommonAuthGuard)
  public async getPositionById(
    @Param('id') positionId: string,
  ): Promise<BaseApiResponse<AdvertisementPositionOutput>> {
    return await this.advertisementPositionService.getPositionById(positionId);
  }

  @Get('')
  @UseGuards(JwtCommonAuthGuard)
  public async getPositions(
    @Query() query: PositionFilter,
  ): Promise<BasePaginationResponse<AdvertisementPositionOutput>> {
    return this.advertisementPositionService.getPositions(query);
  }

  @Get('/user/filter')
  @UseGuards(JwtAuthGuard)
  public async getUserPositions(
    @Query() query: UserPositionFilter,
  ): Promise<BasePaginationResponse<UserPositionOutput>> {
    return this.advertisementPositionService.getUserPositions(query);
  }
}