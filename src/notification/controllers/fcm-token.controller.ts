import { Body, Controller, Patch, Post, UseGuards } from "@nestjs/common";
import { FcmTokenService } from "../providers";
import { JwtAuthGuard } from "src/auth/guards";
import { ReqContext, RequestContext } from "src/shared/request-context";
import { BaseApiResponse, BaseApiResponseWithoutData } from "src/shared/dtos";
import { CreateFcmTokenInput, FcmTokenOutput, UpdateFcmTokenInput } from "../dtos";


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