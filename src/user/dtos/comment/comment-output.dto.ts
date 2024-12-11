import { Expose, Type } from 'class-transformer';
import { CommentUserOutputDto } from '@modules/user/dtos/comment';

export class CommentOutput {
  @Expose()
  public id: string;

  @Expose()
  public description: string;

  @Expose()
  public parentId: string;

  @Expose()
  public level: number;

  @Expose()
  public userId: string;

  @Expose()
  public postId: string;

  @Expose()
  @Type(() => Number)
  public status: number;

  @Expose()
  @Type(() => Number)
  public totalChild: number;

  @Expose()
  public oldestChildOwnerName: string;

  @Expose()
  @Type(() => CommentUserOutputDto)
  user: CommentUserOutputDto;

  @Expose()
  public createBy: string;

  @Expose()
  public modifyBy: string;

  @Expose()
  @Type(() => Date)
  public createdAt: Date;

  @Expose()
  @Type(() => Date)
  public updatedAt: Date;
}
