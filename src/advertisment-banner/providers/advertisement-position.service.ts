
import { AdvertismentPosition } from "#entity/advertisement_banner/advertisement-position.entity";
import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, ILike, In, Not, Repository } from "typeorm";
import { AdvertisementPositionOutput, CreateAdvertisementPositionInput, PositionFilter, UpdateAdvertisementPositionInput, UserPositionFilter, UserPositionOutput } from "../dtos";
import { BaseApiResponse, BasePaginationResponse } from "src/shared/dtos";
import { MESSAGES } from "src/shared/constants";
import { plainToClass, plainToInstance } from "class-transformer";
import { isEmpty } from "@nestjs/common/utils/shared.utils";

@Injectable()
export class AdvertisementPositionService {
  constructor(
    @InjectRepository(AdvertismentPosition)
    private advertisementPositionRepo: Repository<AdvertismentPosition>,
    private readonly dataSource: DataSource
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

  public async getPositionById(
    positionId: string,
  ): Promise<BaseApiResponse<AdvertisementPositionOutput>> {
    const position = await this.advertisementPositionRepo.findOne({
      where: { id: positionId, sysFlag: '1' },
    });
    if (!position) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.POSITION_NOT_EXIST,
        code: 4,
      });
    }
    const positionOutput = plainToClass(AdvertisementPositionOutput, position, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: positionOutput,
      message: MESSAGES.GET_SUCCEED,
      code: 0,
    };
  }

  public async getPositions(
    filter: PositionFilter,
  ): Promise<BasePaginationResponse<AdvertisementPositionOutput>> {
    let wheres: any[] = [];
    const where: any = {
      sysFlag: '1',
    };
    if (filter.positionName) {
      where['positionName'] = ILike(`%${filter.positionName}%`)
    }
    if (filter.statusCd) {
      where['statusCd'] = filter.statusCd;
    }  
    if (isEmpty(wheres)) {
      wheres.push(where);
    }
    
    const positions = await this.advertisementPositionRepo.find({
      where: wheres,
      take: filter.limit,
      skip: filter.skip,
      order: {
        createDate: 'DESC',
      },
    });
    const count = await this.advertisementPositionRepo.count({
      where: wheres,
      order: {
        createDate: 'DESC',
      },
    });
    const positionsOutput = plainToInstance(AdvertisementPositionOutput, positions, {
      excludeExtraneousValues: true,
    });
   
    return {
      listData: positionsOutput,
      total: count,
    };
  }

  public async getUserPositions(
    filter: UserPositionFilter,
  ): Promise<BasePaginationResponse<UserPositionOutput>> {

     // Extract start and end dates from the filter
     const { selectedStartDate, selectedEndDate, skip, limit } = filter;

     // Prepare query to call the PostgreSQL function
     const query = `
       SELECT * 
       FROM get_advertisement_positions($1, $2)
       LIMIT $3 OFFSET $4
     `;
    console.log("vaooo dayyyyyy");
     // Execute the query with the parameters
     const positions = await this.dataSource.query(query, [
       selectedStartDate,
       selectedEndDate,
       limit,
       skip,
     ]);

     console.log(positions);
 
     // Fetch total count of rows (for pagination)
    //  const countQuery = `
    //    SELECT COUNT(*) 
    //    FROM get_advertisement_positions($1, $2)
    //  `;
    //  const countResult = await this.dataSource.query(countQuery, [
    //    selectedStartDate,
    //    selectedEndDate,
    //  ]);
    //  const count = parseInt(countResult[0].count, 10);
 
     // Transform raw data into the expected output format
     
 
     const data: UserPositionOutput[] = positions.map((item: any) =>
      plainToInstance(UserPositionOutput, item, {
        excludeExtraneousValues: true,
      }),
    );
     // Return paginated response
     return {
       listData: data,
       total: 1,
     };
  }
  

}
