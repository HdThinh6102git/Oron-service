import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { AdvertisementBannerService } from "../providers";
import { JwtAuthGuard, JwtCommonAuthGuard } from "src/auth/guards";
import { ReqContext, RequestContext } from "src/shared/request-context";
import { BaseApiResponse, BasePaginationResponse, } from "src/shared/dtos";
import { AdvertisementBannerFilter,  AdvertisementBannerFilterOutput,  AdvertisementBannerOutput, CreateAdvertisementBannerRequestInput } from "../dtos";
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

  @Get('/filter')
  @UseGuards(JwtCommonAuthGuard)
  public async getAdvertisementBanners(
    @ReqContext() ctx: RequestContext,
    @Query() query: AdvertisementBannerFilter,
  ): Promise<BasePaginationResponse<AdvertisementBannerFilterOutput>> {
    console.log(ctx.user.role.name)
    if(ctx.user.role.name == ROLE.USER){
      query.userId = ctx.user.id;
    }
    return await this.advertisementBannerService.getAdvertisementBanners(query);
  }

}