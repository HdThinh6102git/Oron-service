import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AdvertisementPositionService } from "../providers";
import { JwtAdminAuthGuard } from "src/auth/guards";
import { BaseApiResponse } from "src/shared/dtos";
import { AdvertisementPositionOutput, CreateAdvertisementPositionInput } from "../dtos";
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
}