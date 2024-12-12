import { IsOptional } from "class-validator";
import { PaginationParamsDto } from "@modules/shared/dtos";

export class UserPositionFilter extends PaginationParamsDto {

    @IsOptional()
    selectedStartDate: Date;

    @IsOptional()
    selectedEndDate: Date;

}