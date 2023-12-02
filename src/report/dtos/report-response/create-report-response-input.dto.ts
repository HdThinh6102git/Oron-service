import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportResponseInput {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsUUID()
  reportId: string;
}
