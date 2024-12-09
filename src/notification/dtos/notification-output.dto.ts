import { FileOutput } from "@modules/shared/dtos";
import { Expose } from "class-transformer";

export class NotificationOutput {
    @Expose()
    public id: string;

    @Expose()
    public title: string;

    @Expose()
    public itemRid: string;

    @Expose()
    public content: string;

    @Expose()
    public typeCd: string;

    @Expose()
    public createDate: Date;

    @Expose()
    public createBy: string;

    @Expose()
    public creatorName: string | null;

    @Expose()
    public creatorProfilePic: FileOutput | null;
}