
import { AdvertismentPosition } from "#entity/advertisement_banner/advertisement-position.entity";
import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Not, Repository } from "typeorm";
import { AdvertisementPositionOutput, CreateAdvertisementPositionInput, UpdateAdvertisementPositionInput } from "../dtos";
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

  public async updatePosition(
    userId: string,
    input: UpdateAdvertisementPositionInput,
    positionId: string,
  ): Promise<BaseApiResponse<AdvertisementPositionOutput>> {
    //Check if position exist based on id
    const positionExist = await this.advertisementPositionRepo.findOne({
      where: {
        id: positionId,
        sysFlag: '1'
      },
    });
    if (!positionExist) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.POSITION_NOT_EXIST,
        code: 4,
      });
    }
    //Check if position name exist 
    if (input.positionName) {
      const positionNameExist = await this.
      advertisementPositionRepo.findOne({
        where: {
          id: Not(In([positionId])),
          positionName: input.positionName,
          sysFlag: '1',
        },
      });
      if (positionNameExist) {
        throw new HttpException(
          {
            error: true,
            message: MESSAGES.POSITION_NAME_EXIST,
            code: 4,
          },
          HttpStatus.BAD_REQUEST,
        );
      }else{
        positionExist.positionName = input.positionName;
      }
    }

    //Update position data
    if (input.dimention) {
      positionExist.dimention = input.dimention;
    }
    if (input.pricePerDay) {
      positionExist.pricePerDay = input.pricePerDay;
    }
    if (input.statusCd) {
      positionExist.statusCd = input.statusCd;
    }
    if (input.maxDuration) {
      positionExist.maxDuration = input.maxDuration;
    }
    positionExist.modifyBy = userId;
    const position = await this.advertisementPositionRepo.save(positionExist);
    const positionOutput = plainToInstance(AdvertisementPositionOutput, position, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: positionOutput,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };

  }

}