import { IsEnum, IsOptional, IsString } from 'class-validator';
import { USER_STATUS } from '#entity/user/user.entity';

export class UpdateUserInput {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  specificAddress: string;

  @IsOptional()
  @IsString()
  province: string;

  @IsOptional()
  @IsString()
  district: string;

  @IsOptional()
  @IsString()
  ward: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsEnum(USER_STATUS)
  status: USER_STATUS;

  @IsOptional()
  birthDate: Date;

  @IsOptional()
  genderCD: string;

  @IsOptional()
  relatedUrl: string;
}
