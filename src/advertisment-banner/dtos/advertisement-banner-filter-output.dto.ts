import { FileOutput } from "@modules/shared/dtos";
import { Expose, Type } from "class-transformer";

export class AdvertisementBannerFilterOutput {
    
    @Expose()
    public contractId: string;

    @Expose()
    public bannerName: string;

    @Expose()
    public bannerId: string;

    @Expose()
    public positionName: string;

    @Expose()
    public positionDimention: string;

    @Expose()
    public image: FileOutput | null;

    @Expose()
    @Type(() => Date)
    public startDate: Date;

    @Expose()
    @Type(() => Date)
    public endDate: Date;

    @Expose()
    public totalCost: number;

    @Expose()
    public clientName: string;

    @Expose()
    public clientContactNumber: string;

    @Expose()
    public clientEmail: string;

    @Expose()
    public contractStatus: string;

    @Expose()
    public contractRejectReason: string;

    @Expose()
    @Type(() => Date)
    public createDate: Date;

    @Expose()
    @Type(() => Date)
    public modifyDate: Date;
}