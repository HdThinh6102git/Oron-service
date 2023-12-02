import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PostOutput } from '../../post/dtos';
import { UserOutputDto } from '../../user/dtos';

export class ReportOutput {
  @Expose()
  @ApiProperty()
  public id: string;

  @Expose()
  @ApiProperty()
  public title: string;

  @Expose()
  @ApiProperty()
  public description: string;

  @Expose()
  @ApiProperty()
  @Type(() => Date)
  public createdAt: Date;

  @Expose()
  @ApiProperty()
  @Type(() => PostOutput)
  public post: PostOutput;

  @Expose()
  @ApiProperty()
  @Type(() => UserOutputDto)
  public user: UserOutputDto;
}
