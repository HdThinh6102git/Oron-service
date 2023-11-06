import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReactionInput {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  postId: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  type: number;
}
