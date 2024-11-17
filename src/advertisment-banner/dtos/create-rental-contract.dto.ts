import { IsNotEmpty, IsString } from "class-validator";

export class CreateRentalContractInput {

    clientRid: string;
    
    @IsNotEmpty()
    @IsString()
    positionRid: string;

    bannerRid: string;

    @IsNotEmpty()
    startDate: Date;

    @IsNotEmpty()
    endDate: Date;

    totalCost: number;

    statusCd: string;

    createBy: string;
    
    modifyBy: string;
    
    sysFlag: string;
}