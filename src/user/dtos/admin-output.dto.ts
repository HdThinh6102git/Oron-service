import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RoleOutput } from '../../auth/dtos';

export class AdminOutput {
  @Expose()
  @ApiProperty()
  public id: string;

  @Expose()
  @ApiProperty()
  public username: string;

  @Expose()
  @ApiProperty()
  public email: string;

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
}
