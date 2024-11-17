import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AdvertisementBannerService } from "../providers";
import { JwtAuthGuard } from "src/auth/guards";
import { ReqContext, RequestContext } from "src/shared/request-context";
import { BaseApiResponse } from "src/shared/dtos";
import { AdvertisementBannerOutput, CreateAdvertisementBannerRequestInput } from "../dtos";


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
}