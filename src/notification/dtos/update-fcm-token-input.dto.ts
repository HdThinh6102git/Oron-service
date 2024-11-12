import { IsNotEmpty } from "class-validator";

export class UpdateFcmTokenInput {
    @IsNotEmpty()
    deviceToken: string;
}