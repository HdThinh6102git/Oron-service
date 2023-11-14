import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class ReactionOutput {
  @Expose()
  @ApiProperty()
  @Type(() => Number)
  type: number;

  @Expose()
  @ApiProperty()
  public username: string;
}
