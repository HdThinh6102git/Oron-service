import { IsNotEmpty } from "class-validator";

export class PushNotificationInput {
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    itemId: string;

    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    typeCd: string;

    createBy: string;
    
    modifyBy: string;
    
    sysFlag: string;

}