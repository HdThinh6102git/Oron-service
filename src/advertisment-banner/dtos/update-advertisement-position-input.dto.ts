import { IsOptional } from "class-validator";

export class UpdateAdvertisementPositionInput {
    @IsOptional()
    positionName: string;
    
    @IsOptional()
    dimention: string;
    
    @IsOptional()
    pricePerDay: number;

    statusCd: string;

    maxDuration: number;
    
    modifyBy: string;
    
}
