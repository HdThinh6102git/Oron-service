import { IsOptional } from "class-validator";
import { PaginationParamsDto } from "src/shared/dtos";

export class ClientFilter extends PaginationParamsDto {

    @IsOptional()
    name: string;

    @IsOptional()
    contactNum: string;

    @IsOptional()
    emailAddress: string;

}