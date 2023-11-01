import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryInput {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  status: number;
}
