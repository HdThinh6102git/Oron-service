import { CONTRACT_STATUS_CD } from "#entity/advertisement_banner";
import { IsEnum, IsOptional } from "class-validator";
import { PaginationParamsDto } from "src/shared/dtos";

export class AdvertisementBannerFilter extends PaginationParamsDto {

    @IsOptional()
    positionName: string;

    @IsOptional()
    startDate: Date;

    @IsOptional()
    endDate: Date;

    @IsOptional()
    @IsEnum(CONTRACT_STATUS_CD)
    contractStatusCd: CONTRACT_STATUS_CD;

    @IsOptional()
    bannerName: string;

    @IsOptional()
    clientName: string;

    @IsOptional()
    clientContactNumber: string;

    @IsOptional()
    userId: string;


}