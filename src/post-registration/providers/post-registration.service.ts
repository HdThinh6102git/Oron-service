import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, IsNull, Not, Repository } from 'typeorm';
import {
  POST_REGISTRATION_STATUS,
  PostRegistration,
} from '#entity/post-registration.entity';
import { BaseApiResponse, BasePaginationResponse } from '../../shared/dtos';
import {
  CreatePostRegistrationInput,
  PostRegistrationFilter,
  PostRegistrationOutput,
  UpdatePostRegistrationInput,
} from '../dtos';
import { MESSAGES } from '../../shared/constants';
import { Post } from '#entity/post/post.entity';
import { User } from '#entity/user/user.entity';
import { plainToClass, plainToInstance } from 'class-transformer';

@Injectable()
export class PostRegistrationService {
  constructor(
    @InjectRepository(PostRegistration)
    private postRegistrationRepo: Repository<PostRegistration>,
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  public async createNewPostRegistration(
    input: CreatePostRegistrationInput,
    userId: string,
  ): Promise<BaseApiResponse<PostRegistrationOutput>> {
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
    const myPost = await this.postRepo.findOne({
      where: {
        id: input.postId,
        user: { id: userId },
      },
    });
    if (myPost) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.CAN_NOT_REGISTER_YOUR_OWN_POST,
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
    const userRegistered = await this.postRegistrationRepo.findOne({
      where: {
        post: { id: input.postId },
        user: { id: userId },
      },
    });
    if (userRegistered) {
      throw new HttpException(
        {
          error: true,
          message: MESSAGES.USER_REGISTERED_THIS_POST,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const postRegistration = await this.postRegistrationRepo.save({
      ...input,
      post: post,
      user: user,
    });
    const postRegistrationOutput = plainToClass(
      PostRegistrationOutput,
      postRegistration,
      {
        excludeExtraneousValues: true,
      },
    );
    return {
      error: false,
      data: postRegistrationOutput,
      message: MESSAGES.CREATED_SUCCEED,
      code: 0,
    };
  }

  public async updatePostRegistration(
    input: UpdatePostRegistrationInput,
    postRegistrationId: string,
  ): Promise<BaseApiResponse<PostRegistrationOutput>> {
    const postRegistrationExist = await this.postRegistrationRepo.findOne({
      where: {
        id: postRegistrationId,
      },
      relations: ['user', 'post'],
    });
    if (!postRegistrationExist) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.POST_REGISTRATION_NOT_FOUND,
        code: 4,
      });
    }
    //check data input to update
    if (input.message) {
      postRegistrationExist.message = input.message;
    }
    if (typeof input.status === 'number') {
      if (input.status == 0) {
        postRegistrationExist.status = POST_REGISTRATION_STATUS.CANCELED;
      } else if (input.status == 2) {
        postRegistrationExist.status = POST_REGISTRATION_STATUS.REFUSED;
      } else if (input.status == 3) {
        postRegistrationExist.status = POST_REGISTRATION_STATUS.WAITING_RECEIPT;
      } else if (input.status == 4) {
        postRegistrationExist.status = POST_REGISTRATION_STATUS.RECEIVED;
      }
    }
    //save
    const updatedPostRegistration = await this.postRegistrationRepo.save(
      postRegistrationExist,
    );
    //convert to output
    const postRegistrationOutput = plainToClass(
      PostRegistrationOutput,
      updatedPostRegistration,
      {
        excludeExtraneousValues: true,
      },
    );
    return {
      error: false,
      data: postRegistrationOutput,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }

  public async deletePostRegistration(
    postRegistrationId: string,
    userId: string,
  ): Promise<BaseApiResponse<null>> {
    const postRegistrationExist = await this.postRegistrationRepo.findOne({
      where: {
        id: postRegistrationId,
      },
    });
    if (!postRegistrationExist) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.POST_REGISTRATION_NOT_FOUND,
        code: 4,
      });
    }
    const myPostRegistration = await this.postRegistrationRepo.findOne({
      where: {
        id: postRegistrationId,
        user: { id: userId },
      },
    });
    if (!myPostRegistration) {
      throw new HttpException(
        {
          error: true,
          message: MESSAGES.CAN_NOT_DELETE_OTHER_USER_POST_REGISTRATION,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.postRegistrationRepo.delete(postRegistrationId);
    return {
      error: false,
      data: null,
      message: MESSAGES.DELETED_SUCCEED,
      code: 0,
    };
  }

  public async getPostRegistrations(
    filter: PostRegistrationFilter,
  ): Promise<BasePaginationResponse<PostRegistrationOutput>> {
    const where: any = {
      id: Not(IsNull()),
    };
    if (typeof filter.status === 'number') {
      where['status'] = filter.status;
    }
    if (filter.postId) {
      where['post'] = { id: filter.postId };
    }
    if (filter.creatorId) {
      where['user'] = { id: filter.creatorId };
    }
    if (filter.postOwnerId) {
      const postIds = await this.postRepo
        .createQueryBuilder('post')
        .select('post.id')
        .where('post.user_id = :userId', { userId: filter.postOwnerId })
        .execute();
      const postIdArray = [];
      for (let i = 0; i < postIds.length; i++) {
        postIdArray.push(postIds[i].post_id);
      }
      where['post'] = { id: In(postIdArray) };
    }
    if (filter.id) {
      where['id'] = filter.id;
    }
    if (filter.message) {
      where['message'] = ILike(`%${filter.message}%`);
    }
    const postRegistrations = await this.postRegistrationRepo.find({
      where: where,
      take: filter.limit,
      skip: filter.skip,
      order: {
        createdAt: 'DESC',
      },
      relations: ['user', 'post'],
    });
    const count = await this.postRegistrationRepo.count({
      where: where,
    });
    const postRegistrationsOutput = plainToInstance(
      PostRegistrationOutput,
      postRegistrations,
      {
        excludeExtraneousValues: true,
      },
    );
    return {
      listData: postRegistrationsOutput,
      total: count,
    };
  }
}
