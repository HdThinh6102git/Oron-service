import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserOutputDto } from '../../../user/dtos';
import { ReportOutput } from '../report-output.dto';

export class ReportResponseOutput {
  @Expose()
  @ApiProperty()
  public id: string;

  @Expose()
  @ApiProperty()
  public title: string;

  @Expose()
  @ApiProperty()
  public description: string;

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
  @Type(() => ReportOutput)
  public report: ReportOutput;

  @Expose()
  @ApiProperty()
  @Type(() => UserOutputDto)
  public user: UserOutputDto;
}
