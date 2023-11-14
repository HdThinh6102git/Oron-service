import { ApiProperty } from '@nestjs/swagger';
import {IsEnum, IsOptional, IsString} from 'class-validator';
import {Transform} from "class-transformer";
import {POST_REGISTRATION_STATUS} from "#entity/post-registration.entity";

export class UpdatePostRegistrationInput {
  @ApiProperty()
  @IsOptional()
  @IsString()
  message: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(POST_REGISTRATION_STATUS)
  @Transform(({ value }) => (value ? Number(value) : null))
  status: number;
}
