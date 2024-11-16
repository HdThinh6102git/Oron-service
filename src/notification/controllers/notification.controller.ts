import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { NotificationService } from "../providers";
import { BaseApiResponseWithoutData, BasePaginationResponse, PaginationParamsDto } from "src/shared/dtos";
import { NotificationOutput, PushNotificationInput } from "../dtos";
import { ReqContext, RequestContext } from "src/shared/request-context";
import { JwtAuthGuard } from "src/auth/guards";

@Controller('notification')
export class NotificationController {
    constructor(private notificationService: NotificationService) {}

    @Get('/user')
    @UseGuards(JwtAuthGuard)
    public async getNotificationsByUserId(
        @ReqContext() ctx: RequestContext,
        @Query() query: PaginationParamsDto,
    ): Promise<BasePaginationResponse<NotificationOutput>> {
        return this.notificationService.getNotificationsByUserId(ctx.user.id, query);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    public async pushNotification(
        @ReqContext() ctx: RequestContext,
        @Body() body: PushNotificationInput,
    ): Promise<BaseApiResponseWithoutData>{
        return this.notificationService.pushNotification(ctx.user.id, body);
    }
}