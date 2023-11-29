import { PaginationParamsDto } from '../../shared/dtos';
import { IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
export class SavedPostFilter extends PaginationParamsDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  savedAt: Date;

  @IsOptional()
  keyword: string;

  @IsOptional()
  categoryId: string;
}
