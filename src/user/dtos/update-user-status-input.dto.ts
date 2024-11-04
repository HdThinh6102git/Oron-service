import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class UpdateUserStatusInput {
  @IsNotEmpty()
  @IsIn([0,1])
  status?: string;

  @IsNotEmpty()
  @IsString()
  userId?: string;
}
