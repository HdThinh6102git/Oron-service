import { Expose, Type } from 'class-transformer';
import { ReactionOutput, UserOutputDto } from '@modules/user/dtos';
import { CategoryOutput } from '@modules/post/dtos/category';
import { FileOutput } from '@modules/shared/dtos';

export class PostOutput {
  @Expose()
  public id: string;

  @Expose()
  public description: string;

  @Expose()
  public image: FileOutput[] | null;

  @Expose()
  @Type(() => Number)
  public status: number;

  @Expose()
  public fullAddress: string;

  @Expose()
  public provinceId: string;

  @Expose()
  public districtId: string;

  @Expose()
  public wardId: string;

  @Expose()
  public specificAddress: string;

  @Expose()
  @Type(() => UserOutputDto)
  user: UserOutputDto;

  @Expose()
  @Type(() => CategoryOutput)
  category: CategoryOutput;

  @Expose()
  @Type(() => Date)
  public createdAt: Date;

  @Expose()
  @Type(() => Date)
  public updatedAt: Date;

  @Expose()
  totalComments: number;

  @Expose()
  totalReactions: number;

  @Expose()
  isUserReceived: boolean;

  @Expose()
  @Type(() => UserOutputDto)
  reviewer: UserOutputDto | null;

  @Expose()
  reviewStar: number;

  @Expose()
  @Type(() => ReactionOutput)
  currentUserReaction: ReactionOutput;
}
