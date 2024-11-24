import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentInput {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  postId: string;

  @IsOptional()
  parentId: string;

  @IsOptional()
  parentLevel: number;
}
