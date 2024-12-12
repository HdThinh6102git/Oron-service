import { Expose, Type } from 'class-transformer';
import { UserOutputDto } from '@modules/user/dtos';

export class AuthRegisterOutput {
  @Expose()
  token: string;

  @Expose()
  refreshToken: string;

  @Expose()
  @Type(() => UserOutputDto)
  user: UserOutputDto;
}
