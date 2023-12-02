import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from '#entity/report.entity';
import { Repository } from 'typeorm';
import { User } from '#entity/user/user.entity';
import { ReportResponse } from '#entity/report-response.entity';
import {
  CreateReportResponseInput,
  ReportResponseOutput,
  UpdateReportResponseInput,
} from '../dtos';
import {
  BaseApiResponse,
  BasePaginationResponse,
  PaginationParamsDto,
} from '../../shared/dtos';
import { MESSAGES } from '../../shared/constants';
import { plainToClass, plainToInstance } from 'class-transformer';

@Injectable()
export class ReportResponseService {
  constructor(
    @InjectRepository(ReportResponse)
    private reportResponseRepo: Repository<ReportResponse>,
    @InjectRepository(Report)
    private reportRepo: Repository<Report>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  public async createReportResponse(
    input: CreateReportResponseInput,
    userId: string,
  ): Promise<BaseApiResponse<ReportResponseOutput>> {
    const report = await this.reportRepo.findOne({
      where: {
        id: input.reportId,
      },
    });
    if (!report) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.REPORT_NOT_FOUND,
        code: 4,
      });
    }
    const user = await this.userRepo.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException({
        error: true,
        data: null,
        message: MESSAGES.NOT_FOUND_USER,
        code: 4,
      });
    }
    const reportResponse = await this.reportResponseRepo.save({
      ...input,
      report: report,
      user: user,
    });
    const reportResponseOutput = plainToClass(
      ReportResponseOutput,
      reportResponse,
      {
        excludeExtraneousValues: true,
      },
    );
    return {
      error: false,
      data: reportResponseOutput,
      message: MESSAGES.CREATED_SUCCEED,
      code: 0,
    };
  }

  public async deleteReportResponse(
    reportResponseId: string,
  ): Promise<BaseApiResponse<null>> {
    const reportResponse = await this.reportResponseRepo.findOne({
      where: { id: reportResponseId },
    });
    if (!reportResponse) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.REPORT_RESPONSE_NOT_FOUND,
        code: 4,
      });
    }
    await this.reportResponseRepo.delete(reportResponseId);
    return {
      error: false,
      data: null,
      message: MESSAGES.DELETED_SUCCEED,
      code: 0,
    };
  }

  public async updateReportResponse(
    input: UpdateReportResponseInput,
    reportResponseId: string,
  ): Promise<BaseApiResponse<ReportResponseOutput>> {
    const reportResponseExist = await this.reportResponseRepo.findOne({
      where: { id: reportResponseId },
      relations: ['report', 'user'],
    });
    if (!reportResponseExist) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.REPORT_RESPONSE_NOT_FOUND,
        code: 4,
      });
    }
    if (input.description) {
      reportResponseExist.description = input.description;
    }
    if (input.title) {
      reportResponseExist.title = input.title;
    }
    const updatedReportResponse = await this.reportResponseRepo.save(
      reportResponseExist,
    );
    const reportResponseOutput = plainToClass(
      ReportResponseOutput,
      updatedReportResponse,
      {
        excludeExtraneousValues: true,
      },
    );
    return {
      error: false,
      data: reportResponseOutput,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }

  public async getReportResponsesByReportId(
    reportId: string,
    filter: PaginationParamsDto,
  ): Promise<BasePaginationResponse<ReportResponseOutput>> {
    const report = await this.reportRepo.findOne({
      where: {
        id: reportId,
      },
    });
    if (!report) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.REPORT_NOT_FOUND,
        code: 4,
      });
    }
    const reportResponses = await this.reportResponseRepo.find({
      where: { report: { id: report.id } },
      take: filter.limit,
      skip: filter.skip,
      order: {
        createdAt: 'DESC',
      },
      relations: ['user', 'report'],
    });
    const count = await this.reportResponseRepo.count({
      where: { report: { id: report.id } },
    });
    const reportResponsesOutput = plainToInstance(
      ReportResponseOutput,
      reportResponses,
      {
        excludeExtraneousValues: true,
      },
    );
    return {
      listData: reportResponsesOutput,
      total: count,
    };
  }
}
