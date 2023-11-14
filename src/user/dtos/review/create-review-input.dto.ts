import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateReviewInput {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @ApiProperty()
  @Transform(({ value }) => (value ? Number(value) : null))
  @IsIn([1, 2, 3, 4, 5])
  numberStar: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  postId: string;
}
