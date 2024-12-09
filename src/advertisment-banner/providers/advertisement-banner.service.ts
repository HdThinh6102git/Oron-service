import { AdvertisementBanner, AdvertismentPosition, Client, CONTRACT_STATUS_CD, RentalContract } from "#entity/advertisement_banner";
import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { ActiveAdvertisementBannerFilter, ActiveAdvertisementBannerOutput, AdvertisementBannerFilter, AdvertisementBannerFilterOutput, AdvertisementBannerOutput,  CreateAdvertisementBannerRequestInput, UpdateAdvertisementBannerInput } from "../dtos";
import { BaseApiResponse, BaseApiResponseWithoutData, BasePaginationResponse, } from "src/shared/dtos";
import { MESSAGES } from "src/shared/constants";
import { differenceInDays } from 'date-fns'; // library support compute days difference
import { plainToInstance } from "class-transformer";


@Injectable()
export class AdvertisementBannerService {
  constructor(
    @InjectRepository(AdvertisementBanner)
    private advertisementBannerRepo: Repository<AdvertisementBanner>,
    @InjectRepository(Client)
    private clientRepo: Repository<Client>,
    @InjectRepository(RentalContract)
    private rentalContractRepo: Repository<RentalContract>,
    private readonly dataSource: DataSource // Inject DataSource to management transaction and call function from database
  ) {}

  public async createNewAdvertisementBanner(
    userId: string,
    input: CreateAdvertisementBannerRequestInput,
  ): Promise<BaseApiResponse<AdvertisementBannerOutput>> {
    const queryRunner = this.dataSource.createQueryRunner();
    // Bắt đầu transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //1. Insert advertisement banner
      input.bannerInfo.createBy = userId;
      input.bannerInfo.modifyBy = userId;
      input.bannerInfo.sysFlag = '1';
      input.bannerInfo.statusCd = '1';
      const banner = await queryRunner.manager.save(
        this.advertisementBannerRepo.create(input.bannerInfo)
      );

      //2. Check If Client Exist
      let client = await queryRunner.manager.findOne(Client, {
        where: {
          userRid: userId,
          contactNum: input.clientInfo.contactNum,
          emailAddress: input.clientInfo.emailAddress,
          name: input.clientInfo.name,
          sysFlag: '1',
        },
      });

      //3. Insert client (if not exist)
      if (!client) {
        input.clientInfo.createBy = userId;
        input.clientInfo.modifyBy = userId;
        input.clientInfo.userRid = userId;
        input.clientInfo.paymentMethod = '1';
        input.clientInfo.sysFlag = '1';
        client = await queryRunner.manager.save(
          this.clientRepo.create(input.clientInfo)
        );
      }

      //4. Find the price of position
      const position = await queryRunner.manager.findOne(AdvertismentPosition, {
        where: { id: input.rentalContactInfo.positionRid, sysFlag: '1' },
      });

      //4.1. Compute the total price
      let totalPrice = 0;
      if (position) {
        const startDate = new Date(input.rentalContactInfo.startDate);
        const endDate = new Date(input.rentalContactInfo.endDate);
        // compute days difference
        const daysDifference = differenceInDays(endDate, startDate);
        if (daysDifference < 0) {
          throw new HttpException(
            {
              error: true,
              message: 'End date must be greater than or equal to start date.',
              code: 4,
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        totalPrice = (daysDifference + 1) * position.pricePerDay;
      }

      //5. Insert Rental Contract
      input.rentalContactInfo.createBy = userId;
      input.rentalContactInfo.modifyBy = userId;
      input.rentalContactInfo.clientRid = client.id;
      input.rentalContactInfo.bannerRid = banner.id;
      input.rentalContactInfo.totalCost = totalPrice;
      input.rentalContactInfo.statusCd = '1';
      input.rentalContactInfo.sysFlag = '1';
      const rentalContract = await queryRunner.manager.save(
        this.rentalContractRepo.create(input.rentalContactInfo)
      );

      // Commit transaction
      await queryRunner.commitTransaction();

      //6. Return
      const bannerOutput = {
        bannerName: banner.bannerName,
        redirectUrl: banner.redirectUrl,
        clientName: client.name,
        clientContactNum: client.contactNum,
        clientEmailAddress: client.emailAddress,
        startDate: rentalContract.startDate,
        endDate: rentalContract.endDate,
        totalCost: rentalContract.totalCost,
      };

      return {
        error: false,
        data: bannerOutput,
        message: MESSAGES.CREATED_SUCCEED,
        code: 0,
      };
    } catch (error) {
      // Rollback transaction nếu có lỗi
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Giải phóng queryRunner
      await queryRunner.release();
    }
  }

  public async getAdvertisementBannerContracts(
    filter: AdvertisementBannerFilter,
  ): Promise<BasePaginationResponse<AdvertisementBannerFilterOutput>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const result = await queryRunner.query(
        `SELECT * FROM get_advertisement_banners(
          $1, $2, $3, $4, $5, $6, $7, $8
        )`,
        [
          filter.positionName || null,
          filter.startDate || null,
          filter.endDate || null,
          filter.contractStatusCd || null,
          filter.bannerName || null,
          filter.clientName || null,
          filter.clientContactNumber || null,
          filter.userId || null,
        ],
      );
      // Transform raw results to DTO
      console.log(result)
      const data: AdvertisementBannerFilterOutput[] = result.map((item: any) =>
        plainToInstance(AdvertisementBannerFilterOutput, item, {
          excludeExtraneousValues: true,
        }),
      );
      
      return {
        listData: data,
        total: 1,
      };
    }catch (error) {
      throw new Error(`Failed to fetch advertisement banners`);
    } finally {
      await queryRunner.release();
    }
  }

  public async updateAdvertisementBanner(
    userId: string,
    input: UpdateAdvertisementBannerInput,
    bannerId: string,
  ): Promise<BaseApiResponseWithoutData> {
    //Check if banner exist based on id
    const bannerExist = await this.advertisementBannerRepo.findOne({
      where: {
        id: bannerId,
        sysFlag: '1'
      },
    });
    if (!bannerExist) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.BANNER_NOT_EXIST,
        code: 4,
      });
    }
    // Check and update if field exists
    if (input.bannerName) {
      bannerExist.bannerName = input.bannerName;
    }
    if(input.redirectUrl){
      bannerExist.redirectUrl = input.redirectUrl;
    }
    if(input.statusCd){
      bannerExist.statusCd = input.statusCd;
    }
    if(input.bannerName || input.redirectUrl || input.statusCd){
      bannerExist.modifyBy = userId;
      bannerExist.modifyDate = new Date();
      await this.advertisementBannerRepo.save(bannerExist);
    }
    return {
      error: false,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }

  public async deleteAdvertisementBanner(
    bannerId: string,
    userId: string,
  ): Promise<BaseApiResponseWithoutData> {
    //Check if banner exist based on id and user id
    const bannerExist = await this.advertisementBannerRepo.findOne({
      where: {
        id: bannerId,
        sysFlag: '1',
        createBy: userId
      },
    });
    if (!bannerExist) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.BANNER_NOT_EXIST,
        code: 4,
      });
    }
    //Check if contract exist based on id and user id
    const contractExist = await this.rentalContractRepo.findOne({
      where: {
        bannerRid: bannerId,
        sysFlag: '1',
        createBy: userId
      },
    });
    if (!contractExist) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.CONTRACT_NOT_EXIST,
        code: 4,
      });
    }
    //Check if contract is not pending for approval
    if(contractExist.statusCd != CONTRACT_STATUS_CD.PENDING_FOR_APPROVAL){
      throw new HttpException(
        {
          error: true,
          message: 'Can not delete banner with status is not pending for approval.',
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    //soft delete contract
    contractExist.sysFlag = '0'; //soft delete 
    contractExist.modifyBy = userId;
    contractExist.modifyDate = new Date();
    await this.rentalContractRepo.save(contractExist);
    //soft delete banner
    bannerExist.sysFlag = '0'; //soft delete 
    bannerExist.modifyBy = userId;
    bannerExist.modifyDate = new Date();
    await this.advertisementBannerRepo.save(bannerExist);
    return {
      error: false,
      message: MESSAGES.DELETED_SUCCEED,
      code: 0,
    };
  }

  public async getActiveAdvertisementBanners(
    filter: ActiveAdvertisementBannerFilter,
  ): Promise<BasePaginationResponse<ActiveAdvertisementBannerOutput>>
  {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const result = await queryRunner.query(
        `SELECT * FROM get_active_advertisement_banners(
          $1
        )`,
        [
          filter.positionId || null,
        ],
      );
      if (result.length === 0) {
        return {
          listData: [],
          total: 0,
        };
      }
      const total = result[0]?.total || 0;
      // Transform raw results to DTO
      
      const data: ActiveAdvertisementBannerOutput[] = result.map((item: any) =>
        plainToInstance(ActiveAdvertisementBannerOutput, item, {
          excludeExtraneousValues: true,
        }),
      );
      
      return {
        listData: data,
        total: total,
      };
    }catch (error) {
      throw new Error(`Failed to fetch active advertisement banners`);
    } finally {
      await queryRunner.release();
    }
  }
}
