import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserOutputDto } from '../../user/dtos';
import { CategoryOutput } from './category';

export class PostOutput {
  @Expose()
  @ApiProperty()
  public id: string;

  @Expose()
  @ApiProperty()
  public description: string;

  @Expose()
  @ApiProperty()
  public imageURL: string;

  @Expose()
  @ApiProperty()
  public videoURL: string;

  @Expose()
  @ApiProperty()
  public status: number;

  @Expose()
  @ApiProperty()
  public fullAddress: string;

  @Expose()
  @ApiProperty()
  public specificAddress: string;

  @Expose()
  @ApiProperty()
  @Type(() => UserOutputDto)
  user: UserOutputDto;

  @Expose()
  @ApiProperty()
  @Type(() => CategoryOutput)
  category: CategoryOutput;

  @Expose()
  @ApiProperty()
  @Type(() => Date)
  public createdAt: Date;

  @Expose()
  @ApiProperty()
  @Type(() => Date)
  public updatedAt: Date;
}
