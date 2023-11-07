import { IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { REACTION_TYPE } from '#entity/reaction.entity';
import { PaginationParamsDto } from '../../../shared/dtos';

export class ReactionFilter extends PaginationParamsDto {
  @IsOptional()
  @IsEnum(REACTION_TYPE)
  @Transform(({ value }) => (value ? Number(value) : null))
  type: REACTION_TYPE;
}
