import { PaginationParamsDto } from '../../../shared/dtos';
import { IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { COMMENT_STATUS } from '#entity/comment.entity';

export class CommentFilter extends PaginationParamsDto {
  @IsOptional()
  @IsEnum(COMMENT_STATUS)
  @Transform(({ value }) => (value ? Number(value) : null))
  status: COMMENT_STATUS;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  createdDate: Date;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  updatedDate: Date;

  @IsOptional()
  keyword: string;

  @IsOptional()
  userKeyword: string;
}
