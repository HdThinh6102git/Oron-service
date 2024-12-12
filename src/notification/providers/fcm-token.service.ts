import { FcmToken } from "#entity/notification";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { MESSAGES } from "@modules/shared/constants";
import { BaseApiResponse, BaseApiResponseWithoutData } from "@modules/shared/dtos";
import { Repository } from "typeorm";
import { CreateFcmTokenInput, FcmTokenOutput, UpdateFcmTokenInput } from "@modules/notification/dtos";


@Injectable()
export class FcmTokenService {
    constructor(
        @InjectRepository(FcmToken)
        private fcmTokenRepo: Repository<FcmToken>,
    ) {}

    public async createNewFcmToken(
      userId: string,
      input: CreateFcmTokenInput,
    ): Promise<BaseApiResponse<FcmTokenOutput>> {
      input.userRid = userId
      input.createBy = userId
      input.modifyBy = userId
      input.sysFlag = '1'
      input.latestActiveDate = new Date();
      const fcmToken = await this.fcmTokenRepo.save(input);
      const fcmTokenOutput = plainToInstance(FcmTokenOutput, {
        user_rid: fcmToken.userRid,
        device_token: fcmToken.deviceToken,
      });
      return {
        error: false,
        data: fcmTokenOutput,
        message: MESSAGES.CREATED_SUCCEED,
        code: 0,
      };
    }

    public async updateFcmToken(
      userId: string,
      input: UpdateFcmTokenInput,
    ): Promise<BaseApiResponseWithoutData>{
      const result = await this.fcmTokenRepo.update(
        { userRid: userId, deviceToken: input.deviceToken },
        { latestActiveDate: new Date() }
      );
      if (result.affected === 0) {
        return {
          error: false,           
          message: MESSAGES.NO_RECORD_FOUND, 
          code: 0  
        };
      }
      return {
        error: false,           
        message: MESSAGES.UPDATE_SUCCEED, 
        code: 0                 
      };
    }
}