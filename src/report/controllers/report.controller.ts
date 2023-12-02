import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReportService } from '../providers';
import { JwtAuthGuard } from '../../auth/guards';
import { ReqContext, RequestContext } from '../../shared/request-context';
import { BaseApiResponse, BasePaginationResponse } from '../../shared/dtos';
import { CreateReportInput, ReportFilter, ReportOutput } from '../dtos';

@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  public async createReport(
    @ReqContext() ctx: RequestContext,
    @Body() body: CreateReportInput,
  ): Promise<BaseApiResponse<ReportOutput>> {
    return await this.reportService.createReport(body, ctx.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  public async deleteReport(
    @Param('id') reportId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.reportService.deleteReport(reportId);
  }

  @Get('/filter')
  public async getReports(
    @Query() query: ReportFilter,
  ): Promise<BasePaginationResponse<ReportOutput>> {
    return this.reportService.getReports(query);
  }

  @Get(':id')
  public async getReportById(
    @Param('id') reportId: string,
  ): Promise<BaseApiResponse<ReportOutput>> {
    return await this.reportService.getReportById(reportId);
  }
}
