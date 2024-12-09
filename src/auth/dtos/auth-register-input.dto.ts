import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterInput {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  username: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  province: string;

  @IsOptional()
  district: string;

  @IsOptional()
  ward: string;

  @IsOptional()
  specificAddress: string;

  @IsOptional()
  phoneNumber: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  email: string;
}
