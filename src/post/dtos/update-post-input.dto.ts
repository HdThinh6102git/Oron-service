import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostInput {
  @ApiProperty()
  @IsOptional()
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
  @IsNumber()
  @IsOptional()
  status: number;
}
