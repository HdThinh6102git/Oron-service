import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCommentInput {
  @IsOptional()
  @IsString()
  description: string;

  @IsNumber()
  @IsOptional()
  status: number;

  modifyBy: string;

}
