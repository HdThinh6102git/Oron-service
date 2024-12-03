import {  IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UploadSpecificFileInput {

    @IsOptional()
    alternativeText: string;

    @IsNotEmpty()
    @IsString()
    relatedType: string;

    @IsNotEmpty()
    @IsString()
    relatedId: string;
    
    createBy: string;
    
    modifyBy: string;
    
    sysFlag: string;
    
}
