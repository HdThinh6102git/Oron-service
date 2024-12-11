import { Expose } from "class-transformer";
import { FileOutput } from "@modules/shared/dtos";

export class CommentUserOutputDto {
    @Expose()
    public name: string;

    @Expose()
    public profilePic: FileOutput;

}