import { CONTRACT_STATUS_CD } from "#entity/advertisement_banner";
import { IsEnum, IsOptional } from "class-validator";

export class UpdateRentalContractInput {

    @IsOptional()
    @IsEnum(CONTRACT_STATUS_CD)
    statusCd: string;

    @IsOptional()
    rejectReason: string;
}