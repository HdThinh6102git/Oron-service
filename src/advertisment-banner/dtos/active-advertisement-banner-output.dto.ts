import { FileOutput } from "@modules/shared/dtos";
import { Expose } from "class-transformer";

export class ActiveAdvertisementBannerOutput {

    @Expose()
    public bannerName: string;

    @Expose()
    public bannerId: string;

    @Expose()
    public image: FileOutput | null;

    @Expose()
    public redirectUrl: string;

}