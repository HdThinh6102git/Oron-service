import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Report } from '#entity/report.entity';
import { Post } from '#entity/post/post.entity';
import { BaseApiResponse, BasePaginationResponse } from '../../shared/dtos';
import { CreateReportInput, ReportFilter, ReportOutput } from '../dtos';
import { MESSAGES } from '../../shared/constants';
import { plainToClass, plainToInstance } from 'class-transformer';
import { User } from '#entity/user/user.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private reportRepo: Repository<Report>,
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  public async createReport(
    input: CreateReportInput,
    userId: string,
  ): Promise<BaseApiResponse<ReportOutput>> {
    const post = await this.postRepo.findOne({
      where: {
        id: input.postId,
      },
    });
    if (!post) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.POST_NOT_FOUND,
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
    const report = await this.reportRepo.save({
      ...input,
      post: post,
      user: user,
    });
    const reportOutput = plainToClass(ReportOutput, report, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: reportOutput,
      message: MESSAGES.CREATED_SUCCEED,
      code: 0,
    };
  }

  public async deleteReport(reportId: string): Promise<BaseApiResponse<null>> {
    const report = await this.reportRepo.findOne({
      where: { id: reportId },
    });
    if (!report) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.REPORT_NOT_FOUND,
        code: 4,
      });
    }
    await this.reportRepo.delete(reportId);
    return {
      error: false,
      data: null,
      message: MESSAGES.DELETED_SUCCEED,
      code: 0,
    };
  }

  public async getReports(
    filter: ReportFilter,
  ): Promise<BasePaginationResponse<ReportOutput>> {
    const queryBuilder = this.reportRepo.createQueryBuilder('report');
    if (filter.postDescription) {
      queryBuilder.andWhere('post.description ILIKE :postDescription', {
        postDescription: `%${filter.postDescription}%`,
      });
    }
    if (filter.reporterName) {
      queryBuilder.andWhere('user.username ILIKE :reporterName', {
        reporterName: `%${filter.reporterName}%`,
      });
    }
    if (filter.createdAt) {
      queryBuilder.andWhere(
        `TO_CHAR(report.created_at::DATE, 'yyyy-mm-dd') = :createdAt`,
        { createdAt: filter.createdAt },
      );
    }
    if (filter.keyword) {
      queryBuilder.andWhere(
        '(report.description ILIKE :keyword OR report.title ILIKE :keyword)',
        { keyword: `%${filter.keyword}%` },
      );
    }
    const reports = await queryBuilder
      .take(filter.limit)
      .skip(filter.skip)
      .orderBy('report.createdAt', 'DESC')
      .leftJoinAndSelect('report.user', 'user')
      .leftJoinAndSelect('report.post', 'post')
      .getMany();
    const count = await queryBuilder.getCount();
    const reportsOutput = plainToInstance(ReportOutput, reports, {
      excludeExtraneousValues: true,
    });
    return {
      listData: reportsOutput,
      total: count,
    };
  }

  public async getReportById(
    reportId: string,
  ): Promise<BaseApiResponse<ReportOutput>> {
    const report = await this.reportRepo.findOne({
      where: { id: reportId, deletedAt: IsNull() },
      relations: ['user', 'post'],
    });
    if (!report) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.REPORT_NOT_FOUND,
        code: 4,
      });
    }
    const reportOutput = plainToClass(ReportOutput, report, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: reportOutput,
      message: MESSAGES.GET_SUCCEED,
      code: 0,
    };
  }
}
