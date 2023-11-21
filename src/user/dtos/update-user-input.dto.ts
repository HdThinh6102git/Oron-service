import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { USER_STATUS } from '#entity/user/user.entity';

export class UpdateUserInput {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  specificAddress: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  province: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  district: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  ward: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(USER_STATUS)
  status: USER_STATUS;
}
