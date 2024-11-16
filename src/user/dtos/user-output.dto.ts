import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { RoleOutput } from '../../auth/dtos/role-output.dto';

export class UserOutputDto {
  @Expose()
  @ApiProperty()
  public id: string;

  @Expose()
  @ApiProperty()
  public username: string;

  @Expose()
  @ApiProperty()
  public name: string;

  @Expose()
  @ApiProperty()
  public fullAddress: string;

  @Expose()
  @ApiProperty()
  public specificAddress: string;

  @Expose()
  @ApiProperty()
  public phoneNumber: string;

  @Expose()
  @ApiProperty()
  public email: string;

  @Expose()
  @ApiProperty()
  public profilePic: string;

  @Expose()
  @ApiProperty()
  public backgroundPic: string;

  @Expose()
  @ApiProperty()
  public isVerifyPhone: boolean;

  @Expose()
  @ApiProperty()
  public isVerifyEmail: boolean;

  @Expose()
  @ApiProperty()
  public status: string;

  @Expose()
  @ApiProperty()
  @Type(() => Date)
  public updatedAt: Date;

  @Expose()
  @ApiProperty()
  @Type(() => Date)
  public createdAt: Date;

  @Expose()
  @ApiProperty()
  @Type(() => RoleOutput)
  role: RoleOutput;

  @Expose()
  @Transform(({ value }) => value?.toISOString().split('T')[0], { toPlainOnly: true })
  public birthDate: string; // Đổi kiểu thành string để phản ánh định dạng

  @Expose()
  public genderCD: string;

  @Expose()
  public relatedUrl: string;
}
