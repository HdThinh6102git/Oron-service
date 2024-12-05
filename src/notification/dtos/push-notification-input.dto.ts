import { IsNotEmpty } from "class-validator";

export class PushNotificationInput {
    @IsNotEmpty()
    userRid: string;

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    itemRid: string;

    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    typeCd: string;

    createBy: string;
    
    modifyBy: string;
    
    sysFlag: string;

}