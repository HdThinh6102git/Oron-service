import { FcmToken } from "#entity/notification";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { MESSAGES } from "src/shared/constants";
import { BaseApiResponse } from "src/shared/dtos";
import { Repository } from "typeorm";
import { CreateFcmTokenInput, FcmTokenOutput } from "../dtos";


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
}