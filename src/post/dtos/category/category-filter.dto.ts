import { PaginationParamsDto } from '../../../shared/dtos';
import { IsEnum, IsOptional } from 'class-validator';
import { CATEGORY_STATUS } from '#entity/post/category.entity';
import { Transform } from 'class-transformer';

export class CategoryFilter extends PaginationParamsDto {
  @IsOptional()
  @IsEnum(CATEGORY_STATUS)
  @Transform(({ value }) => (value ? Number(value) : null))
  status: CATEGORY_STATUS;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  createdDate: Date;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  updatedDate: Date;

  @IsOptional()
  keyword: string;
}
