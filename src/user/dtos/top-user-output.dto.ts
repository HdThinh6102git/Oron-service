import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { FileOutput } from '@modules/shared/dtos';

export class TopUserOutput {
  @Expose()
  @ApiProperty()
  public id: string;

  @Expose()
  @ApiProperty()
  public username: string;

  @Expose()
  @ApiProperty()
  public profilePic: FileOutput | null;

  @Expose()
  @ApiProperty()
  @Type(() => Number)
  public avg_star: number;

  @Expose()
  @ApiProperty()
  @Type(() => Number)
  public post_count: number;
}
