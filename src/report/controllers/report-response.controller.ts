import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReportResponseService } from '../providers';
import { JwtAdminAuthGuard } from '../../auth/guards';
import { ReqContext, RequestContext } from '../../shared/request-context';
import {
  BaseApiResponse,
  BasePaginationResponse,
  PaginationParamsDto,
} from '../../shared/dtos';
import {
  CreateReportResponseInput,
  ReportResponseOutput,
  UpdateReportResponseInput,
} from '../dtos';

@Controller('report-response')
export class ReportResponseController {
  constructor(private reportResponseService: ReportResponseService) {}

  @Post()
  @UseGuards(JwtAdminAuthGuard)
  public async createReportResponse(
    @ReqContext() ctx: RequestContext,
    @Body() body: CreateReportResponseInput,
  ): Promise<BaseApiResponse<ReportResponseOutput>> {
    return await this.reportResponseService.createReportResponse(
      body,
      ctx.user.id,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAdminAuthGuard)
  public async deleteReportResponse(
    @Param('id') reportResponseId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.reportResponseService.deleteReportResponse(reportResponseId);
  }

  @Patch(':id')
  @UseGuards(JwtAdminAuthGuard)
  public async updateReportResponse(
    @Param('id') reportResponseId: string,
    @Body() body: UpdateReportResponseInput,
  ): Promise<BaseApiResponse<ReportResponseOutput>> {
    return await this.reportResponseService.updateReportResponse(
      body,
      reportResponseId,
    );
  }

  @Get('/report/:reportId')
  @UseGuards(JwtAdminAuthGuard)
  public async getReportResponsesByReportId(
    @Param('reportId') reportId: string,
    @Query() query: PaginationParamsDto,
  ): Promise<BasePaginationResponse<ReportResponseOutput>> {
    return await this.reportResponseService.getReportResponsesByReportId(
      reportId,
      query,
    );
  }
}
