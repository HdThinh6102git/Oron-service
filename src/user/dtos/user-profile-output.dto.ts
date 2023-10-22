import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserProfileOutput {
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
}
