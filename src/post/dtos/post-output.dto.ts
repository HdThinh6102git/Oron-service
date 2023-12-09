import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ReactionOutput, UserOutputDto } from '../../user/dtos';
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
  @Type(() => Number)
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

  @Expose()
  @ApiProperty()
  totalComments: number;

  @Expose()
  @ApiProperty()
  totalReactions: number;

  @Expose()
  @ApiProperty()
  isUserReceived: boolean;

  @Expose()
  @ApiProperty()
  @Type(() => UserOutputDto)
  reviewer: UserOutputDto | null;

  @Expose()
  @ApiProperty()
  reviewStar: number;

  @Expose()
  @ApiProperty()
  @Type(() => ReactionOutput)
  currentUserReaction: ReactionOutput;
}
