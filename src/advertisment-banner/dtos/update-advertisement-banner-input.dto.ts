import { IsOptional } from "class-validator";

export class UpdateAdvertisementBannerInput {
    @IsOptional()
    bannerName: string;
    
    @IsOptional()
    redirectUrl: string;

    @IsOptional()
    statusCd: string;
}