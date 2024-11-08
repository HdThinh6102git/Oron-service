import { POSITION_STATUS_CD } from "#entity/advertisement_banner/advertisement-position.entity";
import { IsEnum, IsOptional } from "class-validator";
import { PaginationParamsDto } from "src/shared/dtos";

export class PositionFilter extends PaginationParamsDto {

    @IsOptional()
    positionName: string;

    @IsOptional()
    dimention: string;

    @IsOptional()
    pricePerDay: number;

    @IsOptional()
    @IsEnum(POSITION_STATUS_CD)
    statusCd: POSITION_STATUS_CD;

    @IsOptional()
    maxDuration: number;

}