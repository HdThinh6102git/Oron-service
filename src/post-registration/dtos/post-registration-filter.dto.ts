import { PaginationParamsDto } from '../../shared/dtos';
import { IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { POST_REGISTRATION_STATUS } from '#entity/post-registration.entity';

export class PostRegistrationFilter extends PaginationParamsDto {
  @IsOptional()
  @IsEnum(POST_REGISTRATION_STATUS)
  @Transform(({ value }) => (value ? Number(value) : null))
  status: POST_REGISTRATION_STATUS;

  @IsOptional()
  postId: string;

  @IsOptional()
  userId: string;

  @IsOptional()
  id: string;

  @IsOptional()
  message: string;
}
