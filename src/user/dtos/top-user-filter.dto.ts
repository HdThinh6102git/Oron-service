import { PaginationParamsDto } from '../../shared/dtos';
import { IsOptional } from 'class-validator';

export class TopUserFilter extends PaginationParamsDto {
  @IsOptional()
  timePeriod: number;
}
