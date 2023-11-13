import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostRegistrationInput {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  postId: string;
}
