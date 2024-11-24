import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdvertisementBannerService } from "../providers";
import { JwtAuthGuard, JwtCommonAuthGuard } from "src/auth/guards";
import { ReqContext, RequestContext } from "src/shared/request-context";
import { BaseApiResponse, BaseApiResponseWithoutData, BasePaginationResponse, } from "src/shared/dtos";
import { ActiveAdvertisementBannerFilter, ActiveAdvertisementBannerOutput, AdvertisementBannerFilter,  AdvertisementBannerFilterOutput,  AdvertisementBannerOutput, CreateAdvertisementBannerRequestInput, UpdateAdvertisementBannerInput } from "../dtos";
import { ROLE } from "src/auth/constants";


@Controller('advertisement-banner')
export class AdvertisementBannerController {
  constructor(private advertisementBannerService: AdvertisementBannerService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  public async createNewAdvertisementBanner(
    @ReqContext() ctx: RequestContext,
    @Body() body: CreateAdvertisementBannerRequestInput,
  ): Promise<BaseApiResponse<AdvertisementBannerOutput>> {
    return await this.advertisementBannerService.createNewAdvertisementBanner(ctx.user.id, body);
  }

  @Get('/contract/filter')
  @UseGuards(JwtCommonAuthGuard)
  public async getAdvertisementBannerContracts(
    @ReqContext() ctx: RequestContext,
    @Query() query: AdvertisementBannerFilter,
  ): Promise<BasePaginationResponse<AdvertisementBannerFilterOutput>> {
    if(ctx.user.role.name == ROLE.USER){
      query.userId = ctx.user.id;
    }
    return await this.advertisementBannerService.getAdvertisementBannerContracts(query);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  public async updateAdvertisementBanner(
    @ReqContext() ctx: RequestContext,
    @Param('id') bannerId: string,
    @Body() body: UpdateAdvertisementBannerInput,
  ): Promise<BaseApiResponseWithoutData> {
    return await this.advertisementBannerService.updateAdvertisementBanner(ctx.user.id, body, bannerId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  public async deleteAdvertisementBanner(
    @Param('id') bannerId: string,
    @ReqContext() ctx: RequestContext,
  ): Promise<BaseApiResponseWithoutData> {
    return this.advertisementBannerService.deleteAdvertisementBanner(bannerId, ctx.user.id);
  }

  @Get('/active')
  @UseGuards(JwtCommonAuthGuard)
  public async getActiveAdvertisementBanners(
    @Query() query: ActiveAdvertisementBannerFilter,
  ): Promise<BasePaginationResponse<ActiveAdvertisementBannerOutput>> {
    return await this.advertisementBannerService.getActiveAdvertisementBanners(query);
  }
}