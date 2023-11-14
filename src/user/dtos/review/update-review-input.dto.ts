import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { REVIEW_STATUS } from '#entity/review.entity';
import { Transform } from 'class-transformer';

export class UpdateReviewInput {
  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(REVIEW_STATUS)
  @Transform(({ value }) => (value ? Number(value) : null))
  status: number;

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : null))
  @IsIn([1, 2, 3, 4, 5])
  numberStar: number;
}
