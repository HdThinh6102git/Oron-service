import { Expose } from "class-transformer";

export class CommentUserOutputDto {
    @Expose()
    public name: string;

    @Expose()
    public profilePic: string;

}