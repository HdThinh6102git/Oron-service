import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdvertisementPositionService } from "../providers";
import { JwtAdminAuthGuard, JwtCommonAuthGuard } from "src/auth/guards";
import { BaseApiResponse, BasePaginationResponse } from "src/shared/dtos";
import { AdvertisementPositionOutput, CreateAdvertisementPositionInput, PositionFilter, UpdateAdvertisementPositionInput } from "../dtos";
import { ReqContext, RequestContext } from "src/shared/request-context";

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
}