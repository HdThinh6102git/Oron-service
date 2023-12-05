import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class BaseApiResponse<T> {
  @Expose()
  @ApiProperty()
  error: boolean;

  @Expose()
  @ApiProperty()
  data: T;

  @Expose()
  @ApiProperty()
  message: string;

  @Expose()
  @ApiProperty()
  code: number;
}

export class BasePaginationResponse<T> {
  @Expose()
  listData: T[];

  @Expose()
  total: number;
}

export class ReactionPaginationResponse<T> extends BasePaginationResponse<T> {
  @Expose()
  listType: number[];
}

export class TopUserPaginationResponse<T> {
  @Expose()
  listData: T[];
}
