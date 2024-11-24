import { Expose, Type } from "class-transformer";

export class ClientOutput {

    @Expose()
    public id: string;

    @Expose()
    public name: string;

    @Expose()
    public contactNum: string;

    @Expose()
    public emailAddress: string;

    @Expose()
    paymentMethod: string;

    @Expose()
    @Type(() => Number)
    public numberRentalContract: number;

}