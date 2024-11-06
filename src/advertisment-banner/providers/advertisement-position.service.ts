
import { AdvertismentPosition } from "#entity/advertisement_banner/advertisement-position.entity";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AdvertisementPositionOutput, CreateAdvertisementPositionInput } from "../dtos";
import { BaseApiResponse } from "src/shared/dtos";
import { MESSAGES } from "src/shared/constants";
import { plainToInstance } from "class-transformer";

@Injectable()
export class AdvertisementPositionService {
  constructor(
    @InjectRepository(AdvertismentPosition)
    private advertisementPositionRepo: Repository<AdvertismentPosition>,
  ) {}

  public async createNewPosition(
    userId: string,
    input: CreateAdvertisementPositionInput,
  ): Promise<BaseApiResponse<AdvertisementPositionOutput>> {
    const positionExist = await this.advertisementPositionRepo.findOne({
      where: { positionName: input.positionName, sysFlag: '1'},
    });
    if (positionExist) {
      throw new HttpException(
        {
          error: true,
          message: MESSAGES.POSITION_NAME_EXIST,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    input.createBy = userId
    input.modifyBy = userId
    input.sysFlag = '1'
    input.statusCd = '1'
    const position = await this.advertisementPositionRepo.save(input);
    const positionOutput = plainToInstance(AdvertisementPositionOutput, position);
    return {
      error: false,
      data: positionOutput,
      message: MESSAGES.CREATED_SUCCEED,
      code: 0,
    };
  }

}