import {  IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateAdvertisementPositionInput {
    @IsNotEmpty()
    @IsString()
    positionName: string;

    @IsNotEmpty()
    @IsString()
    dimention: string;

    @IsNotEmpty()
    @IsNumber()
    pricePerDay: number;

    statusCd: string;

    @IsNotEmpty()
    @IsNumber()
    maxDuration: number;
    
    createBy: string;
    
    modifyBy: string;
    
    sysFlag: string;
    
}
