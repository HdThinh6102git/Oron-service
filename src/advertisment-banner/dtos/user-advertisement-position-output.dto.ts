import { Expose} from "class-transformer";

export class UserPositionOutput {
    @Expose()
    public id: string;

    @Expose()
    public positionName: string;

    @Expose()
    public dimention: string;

    @Expose()
    public pricePerDay: number;

    @Expose()
    public dateStatusCd: string;

}