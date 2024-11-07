import { IsOptional } from "class-validator";

export class UpdateAdvertisementPositionInput {
    @IsOptional()
    positionName: string;
    
    @IsOptional()
    dimention: string;
    
    @IsOptional()
    pricePerDay: number;

    @IsOptional()
    statusCd: string;

    @IsOptional()
    maxDuration: number;
    
    modifyBy: string;
    
}
