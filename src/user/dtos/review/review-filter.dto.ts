import { PaginationParamsDto } from '../../../shared/dtos';
import { IsEnum, IsIn, IsOptional, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { REVIEW_STATUS } from '#entity/review.entity';

export class ReviewFilter extends PaginationParamsDto {
  @IsOptional()
  @IsEnum(REVIEW_STATUS)
  @Transform(({ value }) => (value ? Number(value) : null))
  status: REVIEW_STATUS;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  createdDate: Date;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  updatedDate: Date;

  @IsOptional()
  @IsUUID()
  postId: string;

  @IsOptional()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsUUID()
  id: string;

  @IsOptional()
  description: string;

  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : null))
  @IsIn([1, 2, 3, 4, 5])
  numberStar: number;
}
