import { Body, Controller, Patch, Post, UseGuards } from "@nestjs/common";
import { FcmTokenService } from "@modules/notification/providers";
import { JwtAuthGuard } from "@modules/auth/guards";
import { ReqContext, RequestContext } from "@modules/shared/request-context";
import { BaseApiResponse, BaseApiResponseWithoutData } from "@modules/shared/dtos";
import { CreateFcmTokenInput, FcmTokenOutput, UpdateFcmTokenInput } from "@modules/notification/dtos";


@Controller('fcm-token')
export class FcmTokenController {
    constructor(private fcmTokenService: FcmTokenService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    public async createNewFcmToken(
        @ReqContext() ctx: RequestContext,
        @Body() body: CreateFcmTokenInput,
    ): Promise<BaseApiResponse<FcmTokenOutput>> {
        return await this.fcmTokenService.createNewFcmToken(ctx.user.id, body);
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    public async updateFcmToken(
        @ReqContext() ctx: RequestContext,
        @Body() body: UpdateFcmTokenInput,
    ): Promise<BaseApiResponseWithoutData> {
        return await this.fcmTokenService.updateFcmToken(ctx.user.id, body);
    }
}