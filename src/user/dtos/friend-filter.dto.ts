import { PaginationParamsDto } from '../../shared/dtos';
import { IsOptional } from 'class-validator';

export class FriendFilter extends PaginationParamsDto {
  @IsOptional()
  name: string;

  @IsOptional()
  fullAddress: string;

  @IsOptional()
  specificAddress: string;
}
