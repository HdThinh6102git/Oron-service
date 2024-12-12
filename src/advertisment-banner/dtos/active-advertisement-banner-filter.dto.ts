import { IsOptional } from "class-validator";
import { PaginationParamsDto } from "@modules/shared/dtos";

export class ActiveAdvertisementBannerFilter extends PaginationParamsDto {

    @IsOptional()
    positionId: string;
}