import { CONTRACT_STATUS_CD, RentalContract } from "#entity/advertisement_banner";
import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseApiResponseWithoutData } from "@modules/shared/dtos";
import { Repository } from "typeorm";
import { UpdateRentalContractInput } from "@modules/advertisment-banner/dtos";
import { MESSAGES } from "@modules/shared/constants";

@Injectable()
export class RentalContractService {
  constructor(
    @InjectRepository(RentalContract)
    private rentalContractRepo: Repository<RentalContract>,
  ) {}
  public async updateRentalContract(
    userId: string,
    input: UpdateRentalContractInput,
    contractId: string,
  ): Promise<BaseApiResponseWithoutData> {
    //Check if contract exist based on id
    const contractExist = await this.rentalContractRepo.findOne({
      where: {
        id: contractId,
        sysFlag: '1'
      },
    });
    if (!contractExist) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.CONTRACT_NOT_EXIST,
        code: 4,
      });
    }
    //Update rental contract
    //Throw exception when reject without reason
    if(input.statusCd == CONTRACT_STATUS_CD.REJECTED && !input.rejectReason){
      throw new HttpException(
        {
          error: true,
          message: 'Reason is required when reject.',
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    //Update reject reason
    if(input.rejectReason){
      contractExist.rejectReason = input.rejectReason;
    }
    //Update status
    if(input.statusCd){
      contractExist.statusCd = input.statusCd;
      contractExist.modifyBy = userId;
      contractExist.modifyDate = new Date();
      await this.rentalContractRepo.save(contractExist);
    }
    return {
      error: false,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }
}