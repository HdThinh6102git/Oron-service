import { IsOptional } from "class-validator";
import { PaginationParamsDto } from "src/shared/dtos";

export class ActiveAdvertisementBannerFilter extends PaginationParamsDto {

    @IsOptional()
    positionId: string;
}