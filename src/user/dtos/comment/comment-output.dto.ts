import { Expose, Type } from 'class-transformer';

export class CommentOutput {
  @Expose()
  public id: string;

  @Expose()
  public description: string;

  @Expose()
  public parentId: string;

  @Expose()
  public parentLevel: string;

  @Expose()
  public userId: string;

  @Expose()
  public postId: string;

  // @Expose()
  // @Type(() => Number)
  // public status: number;

  // @Expose()
  // @Type(() => UserOutputDto)
  // user: UserOutputDto;

  // @Expose()
  // @ApiProperty()
  // @Type(() => PostOutput)
  // post: PostOutput;

  @Expose()
  @Type(() => Date)
  public createdAt: Date;

  @Expose()
  @Type(() => Date)
  public updatedAt: Date;
}
