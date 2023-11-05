import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserOutputDto } from '../user-output.dto';
import { PostOutput } from '../../../post/dtos';

export class CommentOutput {
  @Expose()
  @ApiProperty()
  public id: string;

  @Expose()
  @ApiProperty()
  public description: string;

  @Expose()
  @ApiProperty()
  public status: number;

  @Expose()
  @ApiProperty()
  @Type(() => UserOutputDto)
  user: UserOutputDto;

  @Expose()
  @ApiProperty()
  @Type(() => PostOutput)
  post: PostOutput;

  @Expose()
  @ApiProperty()
  @Type(() => Date)
  public createdAt: Date;

  @Expose()
  @ApiProperty()
  @Type(() => Date)
  public updatedAt: Date;
}
