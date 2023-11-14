import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { Review, REVIEW_STATUS } from '#entity/review.entity';
import {
  CreateReviewInput,
  ReviewFilter,
  ReviewOutput,
  UpdateReviewInput,
} from '../../dtos';
import { BaseApiResponse, BasePaginationResponse } from '../../../shared/dtos';
import { MESSAGES } from '../../../shared/constants';
import { User } from '#entity/user/user.entity';
import {
  POST_REGISTRATION_STATUS,
  PostRegistration,
} from '#entity/post-registration.entity';
import { Post } from '#entity/post/post.entity';
import { plainToClass, plainToInstance } from 'class-transformer';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(PostRegistration)
    private postRegistrationRepo: Repository<PostRegistration>,
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
  ) {}
  public async createNewReview(
    input: CreateReviewInput,
    userId: string,
  ): Promise<BaseApiResponse<ReviewOutput>> {
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
    const userReceived = await this.postRegistrationRepo.findOne({
      where: {
        post: { id: input.postId },
        user: { id: userId },
        status: POST_REGISTRATION_STATUS.RECEIVED,
      },
    });
    if (!userReceived) {
      throw new HttpException(
        {
          error: true,
          message: MESSAGES.CAN_NOT_REVIEW_POST_HAVE_NOT_RECEIVED,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const userReviewed = await this.reviewRepo.findOne({
      where: {
        post: { id: input.postId },
        user: { id: userId },
      },
    });
    if (userReviewed) {
      throw new HttpException(
        {
          error: true,
          message: MESSAGES.CAN_NOT_REVIEW_MULTIPLE_TIME,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const review = await this.reviewRepo.save({
      ...input,
      post: post,
      user: user,
    });
    const reviewOutput = plainToClass(ReviewOutput, review, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: reviewOutput,
      message: MESSAGES.CREATED_SUCCEED,
      code: 0,
    };
  }

  public async updateReview(
    input: UpdateReviewInput,
    reviewId: string,
  ): Promise<BaseApiResponse<ReviewOutput>> {
    const reviewExist = await this.reviewRepo.findOne({
      where: {
        id: reviewId,
      },
      relations: ['user', 'post'],
    });
    if (!reviewExist) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.REVIEW_NOT_FOUND,
        code: 4,
      });
    }
    if (input.description) {
      reviewExist.description = input.description;
    }
    if (typeof input.status === 'number') {
      if (input.status == 0) {
        reviewExist.status = REVIEW_STATUS.IN_ACTIVE;
      } else if (input.status == 2) {
        reviewExist.status = REVIEW_STATUS.ACTIVE;
      }
    }
    if (typeof input.numberStar === 'number') {
      reviewExist.numberStar = input.numberStar;
    }
    //save
    const updatedReview = await this.reviewRepo.save(reviewExist);
    //convert to output
    const reviewOutput = plainToClass(ReviewOutput, updatedReview, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: reviewOutput,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }

  public async deleteReview(
    reviewId: string,
    userId: string,
  ): Promise<BaseApiResponse<null>> {
    const reviewExist = await this.reviewRepo.findOne({
      where: {
        id: reviewId,
      },
    });
    if (!reviewExist) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.REVIEW_NOT_FOUND,
        code: 4,
      });
    }
    const myReview = await this.reviewRepo.findOne({
      where: {
        id: reviewId,
        user: { id: userId },
      },
    });
    if (!myReview) {
      throw new HttpException(
        {
          error: true,
          message: MESSAGES.CAN_NOT_DELETE_OTHER_USER_REVIEW,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.reviewRepo.delete(reviewId);
    return {
      error: false,
      data: null,
      message: MESSAGES.DELETED_SUCCEED,
      code: 0,
    };
  }

  public async getReviews(
    filter: ReviewFilter,
  ): Promise<BasePaginationResponse<ReviewOutput>> {
    const where: any = {
      id: Not(IsNull()),
    };
    if (typeof filter.status === 'number') {
      where['status'] = filter.status;
    }
    if (filter.postId) {
      where['post'] = { id: filter.postId };
    }
    if (filter.userId) {
      where['user'] = { id: filter.userId };
    }
    if (filter.id) {
      where['id'] = filter.id;
    }
    if (filter.description) {
      where['description'] = ILike(`%${filter.description}%`);
    }
    if (typeof filter.numberStar === 'number') {
      where['numberStar'] = filter.numberStar;
    }
    const reviews = await this.reviewRepo.find({
      where: where,
      take: filter.limit,
      skip: filter.skip,
      order: {
        createdAt: 'DESC',
      },
      relations: ['user', 'post'],
    });
    const count = await this.reviewRepo.count({
      where: where,
    });
    const reviewsOutput = plainToInstance(ReviewOutput, reviews, {
      excludeExtraneousValues: true,
    });
    return {
      listData: reviewsOutput,
      total: count,
    };
  }
}
