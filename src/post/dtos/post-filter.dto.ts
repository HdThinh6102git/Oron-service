import { PaginationParamsDto } from '../../shared/dtos';
import { IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { POST_STATUS } from '#entity/post/post.entity';
import { POST_REGISTRATION_STATUS } from '#entity/post-registration.entity';

export class PostFilter extends PaginationParamsDto {
  @IsOptional()
  @IsEnum(POST_STATUS)
  @Transform(({ value }) => (value ? Number(value) : null))
  status: POST_STATUS;

  @IsOptional()
  @IsEnum(POST_REGISTRATION_STATUS)
  @Transform(({ value }) => (value ? Number(value) : null))
  registration_status: POST_REGISTRATION_STATUS;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  createdDate: Date;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  updatedDate: Date;

  @IsOptional()
  keyword: string;

  @IsOptional()
  userId: string;

  @IsOptional()
  categoryId: string;

  @IsOptional()
  friends: boolean;
}
