import { IsNotEmpty } from "class-validator";

export class CreateFcmTokenInput {
    @IsNotEmpty()
    deviceToken: string;

    userRid: string;

    createBy: string;
    
    modifyBy: string;
    
    sysFlag: string;

}