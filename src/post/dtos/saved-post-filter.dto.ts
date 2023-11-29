import { PaginationParamsDto } from '../../shared/dtos';
import { IsOptional } from 'class-validator';

export class SavedPostFilter extends PaginationParamsDto {
  @IsOptional()
  savedAt: Date;

  @IsOptional()
  keyword: string;

  @IsOptional()
  categoryId: string;
}
