import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

export class AdvertisementPositionOutput {
    @Expose()
    @ApiProperty()
    public id: string;

    @Expose()
    @ApiProperty()
    public positionName: string;

    @Expose()
    @ApiProperty()
    public dimention: string;

    @Expose()
    @ApiProperty()
    public pricePerDay: number;

    @Expose()
    @ApiProperty()
    public statusCd: string;

    @Expose()
    @ApiProperty()
    public maxDuration: number;

    @Expose()
    @ApiProperty()
    public createBy: string;

    @Expose()
    @ApiProperty()
    public modifyBy: string;

    @Expose()
    @ApiProperty()
    @Type(() => Date)
    public createDate: Date;

    @Expose()
    @ApiProperty()
    @Type(() => Date)
    public modifyDate: Date;

    @Expose()
    @ApiProperty()
    public sysFlag: string;
    
}