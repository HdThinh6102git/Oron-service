import { FcmToken, Notification } from "#entity/notification";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseApiResponseWithoutData, BasePaginationResponse, PaginationParamsDto } from "@modules/shared/dtos";
import { isEmpty } from "@nestjs/common/utils/shared.utils";
import { plainToInstance } from "class-transformer";
import { Injectable } from "@nestjs/common";
import { NotificationOutput, PushNotificationInput } from "@modules/notification/dtos";
import * as firebase from 'firebase-admin';
import { MESSAGES } from "@modules/shared/constants";
import { RELATED_TYPE, User } from "@modules/entity";
import { FileService } from "@modules/shared/providers";

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification) private readonly notificationRepo: Repository<Notification>,
        @InjectRepository(FcmToken) private readonly fcmTokenRepo: Repository<FcmToken>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private fileService: FileService,
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

        
        for (let i = 0; i < notificationsOutput.length; i++) {
            const user = await this.userRepository.findOne({
                where: { 
                  id: notificationsOutput[i].createBy,
                  sysFlag: '1' 
                },
            });
            
            if(user){
                notificationsOutput[i].creatorName = user.name
                const imageProfileObject = await this.fileService.getRelatedFile(notificationsOutput[i].createBy, RELATED_TYPE.USER_PROFILE);
                if(imageProfileObject){
                    notificationsOutput[i].creatorProfilePic = imageProfileObject;
                }
            }
            
        }
        return {
            listData: notificationsOutput,
            total: 1,
        };
    };

    public async pushNotification(
        userId: string,
        input: PushNotificationInput
    ): Promise<BaseApiResponseWithoutData> {
        // Lấy danh sách token FCM của user
        const fcmTokens = await this.fcmTokenRepo.find({
            where: {
                userRid: input.userRid,
                sysFlag: '1',
            },
        });
    
        // Lưu thông tin thông báo
        input.createBy = userId;
        input.modifyBy = userId;
        input.sysFlag = '1';
        await this.notificationRepo.save(input);
    
        // Kiểm tra token
        if (!fcmTokens || fcmTokens.length === 0) {
            return {
                error: true,
                message: MESSAGES.NO_FCM_TOKENS_FOUND,
                code: 1,
            };
        }
    
        // Gửi thông báo cho từng token
        try {
            for (const tokenData of fcmTokens) {
                
                const token = tokenData.deviceToken;
                console.log("token", token, "/n"); 

                console.log("title",input.title, "/n" )
                console.log("content", input.content, "/n")

                try {
                    await firebase.messaging().send({
                        notification: {
                            title: input.title,
                            body: input.content,
                        },
                        token: token,
                        data: {
                            // Các dữ liệu thêm nếu cần
                            userRid: input.userRid,
                        },
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
                                    alert: {
                                        title: input.title,
                                        body: input.content,
                                    },
                                    sound: 'default',
                                },
                            },
                        },
                        webpush: {
                            headers: {
                                TTL: '4500', // Thời gian sống của thông báo
                            },
                            // Không cần thêm nội dung `notification` vào đây vì đã có `notification` chính
                        },
                    });
                } catch (error) {
                    console.error(`Failed to send notification to token ${token}:`, error);
                }
            }
        } catch (error) {
            console.error("Error in sending push notifications:", error);
            return {
                error: true,
                message: MESSAGES.PUSH_NOTIFICATION_FAILED,
                code: 2,
            };
        }
    
        return {
            error: false,
            message: MESSAGES.PUSH_NOTIFICATION_SUCCESSFULLY,
            code: 0,
        };
    }
    
    
}