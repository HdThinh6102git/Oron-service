import { PaginationParamsDto } from '../../shared/dtos';
import { IsOptional, IsString } from 'class-validator';

export class UserFilter extends PaginationParamsDto {
  @IsOptional()
  @IsString()
  keyword: string;
}
