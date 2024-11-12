import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { FcmTokenService } from "../providers";
import { JwtAuthGuard } from "src/auth/guards";
import { ReqContext, RequestContext } from "src/shared/request-context";
import { BaseApiResponse } from "src/shared/dtos";
import { CreateFcmTokenInput, FcmTokenOutput } from "../dtos";


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
}