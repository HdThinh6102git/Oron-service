import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReactionOutput {
  @Expose()
  @ApiProperty()
  type: number;

  @Expose()
  @ApiProperty()
  public username: string;
}
