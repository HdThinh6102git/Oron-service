import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { POST_STATUS } from '#entity/post/post.entity';

export class CreatePostInput {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  imageURL: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  videoURL: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  provinceId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  districtId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  wardId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  specificAddress: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  categoryId: string;

  @ApiProperty()
  @IsEnum(POST_STATUS)
  @IsNotEmpty()
  status: number;
}
