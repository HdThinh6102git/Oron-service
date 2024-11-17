import { IsNotEmpty } from "class-validator";

export class CreateClientInput {
    userRid: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    contactNum: string;

    @IsNotEmpty()
    emailAddress: string;

    paymentMethod: string;

    createBy: string;

    modifyBy: string;

    sysFlag: string;
}