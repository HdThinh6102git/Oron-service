import { PaginationParamsDto } from '../../shared/dtos';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class TopUserFilter extends PaginationParamsDto {
  @IsNotEmpty()
  @Transform(({ value }) => (value ? Number(value) : null))
  @IsNumber()
  weekNumber: number;
}
