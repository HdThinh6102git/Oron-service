import { PaginationParamsDto } from '../../shared/dtos';
import { IsOptional } from 'class-validator';

export class ReportFilter extends PaginationParamsDto {
  @IsOptional()
  keyword: string;

  @IsOptional()
  postDescription: string;

  @IsOptional()
  reporterName: string;

  @IsOptional()
  createdAt: Date;
}
