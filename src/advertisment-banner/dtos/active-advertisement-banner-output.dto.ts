import { Expose } from "class-transformer";

export class ActiveAdvertisementBannerOutput {

    @Expose()
    public bannerName: string;

    @Expose()
    public redirectUrl: string;

}