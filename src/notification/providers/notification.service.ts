import { FcmToken, Notification } from "#entity/notification";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseApiResponseWithoutData, BasePaginationResponse, PaginationParamsDto } from "src/shared/dtos";
import { isEmpty } from "@nestjs/common/utils/shared.utils";
import { plainToInstance } from "class-transformer";
import { Injectable } from "@nestjs/common";
import { NotificationOutput, PushNotificationInput } from "../dtos";
import * as firebase from 'firebase-admin';
import { MESSAGES } from "src/shared/constants";

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification) private readonly notificationRepo: Repository<Notification>,
        @InjectRepository(FcmToken) private readonly fcmTokenRepo: Repository<FcmToken>,
    ) {}

    public async getNotificationsByUserId(
        userId: string, filter: PaginationParamsDto
    ): Promise<BasePaginationResponse<NotificationOutput>> {
        let wheres: any[] = [];
        const where: any = {
            sysFlag: '1',
        };
        if (userId) {
            where['userRid'] = userId;
        }  
        if (isEmpty(wheres)) {
            wheres.push(where);
        }
        const notifications =  await this.notificationRepo.find({
            where: wheres,
                take: filter.limit,
                skip: filter.skip,
                order: {
                createDate: 'DESC',
            },
        });
        const notificationsOutput = plainToInstance(NotificationOutput, notifications, {
            excludeExtraneousValues: true,
        });
        return {
            listData: notificationsOutput,
            total: 1,
        };
    };

    public async pushNotification(
        userId: string, 
        input: PushNotificationInput
    ): Promise<BaseApiResponseWithoutData> {
        // Get FCM tokens of the user (Notification's Receiver)
        const fcmTokens = await this.fcmTokenRepo.find({
            where: {
                userRid: input.userId,
                sysFlag: '1'
            },
        });
    
        // Save notification info
        input.createBy = userId;
        input.modifyBy = userId;
        input.sysFlag = '1';
        await this.notificationRepo.save(input);
    
        // Loop and push notification for all active FCM tokens of the user
        try {
            for (const tokenData of fcmTokens) {
                const token = tokenData.deviceToken; 
                await firebase
                    .messaging()
                    .send({
                        notification: {
                            title: input.title,
                            body: input.content,
                        },
                        token: token,
                        data: {},
                        android: {
                            priority: 'high',
                            notification: {
                                sound: 'default',
                                channelId: 'default',
                            },
                        },
                        apns: {
                            headers: {
                                'apns-priority': '10',
                            },
                            payload: {
                                aps: {
                                    contentAvailable: true,
                                    sound: 'default',
                                },
                            },
                        },
                    })
                    .catch((error: any) => {
                        console.error(`Failed to send notification to token ${token}:`, error);
                    });
            }
        } catch (error) {
            console.log("Error in sending push notifications:", error);
        }
        return {
            error: false,           
            message: MESSAGES.PUSH_NOTIFICATION_SUCCESSFULLY, 
            code: 0                 
        };
    };
    
}