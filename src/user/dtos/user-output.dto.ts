import { Expose, Transform, Type } from 'class-transformer';
import { RoleOutput } from '@modules/auth/dtos/role-output.dto';
import { FileOutput } from '@modules/shared/dtos';

export class UserOutputDto {
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
  public profilePic: FileOutput | null;

  @Expose()
  public backgroundPic: FileOutput | null;

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
  @Type(() => RoleOutput)
  role: RoleOutput;

  @Expose()
  @Transform(({ value }) => value?.toISOString().split('T')[0], { toPlainOnly: true })
  public birthDate: string; 

  @Expose()
  public genderCD: string;

  @Expose()
  public relatedUrl: string;
}
