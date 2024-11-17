import { Expose } from "class-transformer";

export class AdvertisementBannerOutput {

    @Expose()
    public bannerName: string;

    @Expose()
    public redirectUrl: string;

    @Expose()
    public clientName: string;

    @Expose()
    public clientContactNum: string;

    @Expose()
    public clientEmailAddress: string;

    @Expose()
    public startDate: Date;

    @Expose()
    public endDate: Date;

    @Expose()
    public totalCost: number;
    
}