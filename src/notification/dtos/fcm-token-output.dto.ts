import { Expose } from "class-transformer";


export class FcmTokenOutput {
    @Expose()
    public id: string;

    @Expose()
    deviceToken: string;

    @Expose()
    userRid: string;

    @Expose()
    latestActiveDate: Date;
}