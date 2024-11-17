import { AdvertisementBanner, AdvertismentPosition, Client, RentalContract } from "#entity/advertisement_banner";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { AdvertisementBannerOutput, CreateAdvertisementBannerRequestInput } from "../dtos";
import { BaseApiResponse } from "src/shared/dtos";
import { MESSAGES } from "src/shared/constants";
import { differenceInDays } from 'date-fns'; // Thư viện hỗ trợ tính toán ngày

@Injectable()
export class AdvertisementBannerService {
  constructor(
    @InjectRepository(AdvertisementBanner)
    private advertisementBannerRepo: Repository<AdvertisementBanner>,
    @InjectRepository(Client)
    private clientRepo: Repository<Client>,
    @InjectRepository(RentalContract)
    private rentalContractRepo: Repository<RentalContract>,
    private readonly dataSource: DataSource // Inject DataSource để quản lý transaction
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
}
