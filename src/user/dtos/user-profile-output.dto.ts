import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserProfileOutput {
  @Expose()
  public id: string;

  @Expose()
  public username: string;

  @Expose()
  public name: string;

  @Expose()
  public fullAddress: string;

  @Expose()
  public specificAddress: string;

  @Expose()
  public phoneNumber: string;

  @Expose()
  public email: string;

  @Expose()
  @ApiProperty()
  public profilePic: string;

  @Expose()
  public backgroundPic: string;

  @Expose()
  public isVerifyPhone: boolean;

  @Expose()
  public isVerifyEmail: boolean;

  @Expose()
  public status: string;

  @Expose()
  @Type(() => Date)
  public updatedAt: Date;

  @Expose()
  @Type(() => Date)
  public createdAt: Date;

  @Expose()
  @Transform(({ value }) => value?.toISOString().split('T')[0], { toPlainOnly: true })
  public birthDate: string; // Đổi kiểu thành string để phản ánh định dạng

  @Expose()
  public genderCD: string;

  @Expose()
  public relatedUrl: string;
}
