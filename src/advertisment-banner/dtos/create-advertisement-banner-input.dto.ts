import { IsNotEmpty, IsString } from "class-validator";

export class CreateAdvertisementBannerInput {
    @IsNotEmpty()
    @IsString()
    bannerName: string;

    @IsNotEmpty()
    @IsString()
    redirectUrl: string;

    statusCd: string;
    
    createBy: string;
    
    modifyBy: string;
    
    sysFlag: string;
    
}