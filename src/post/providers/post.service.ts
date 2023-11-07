import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { Post, POST_STATUS } from '#entity/post/post.entity';
import { BaseApiResponse, BasePaginationResponse } from '../../shared/dtos';
import { MESSAGES } from '../../shared/constants';
import { plainToClass, plainToInstance } from 'class-transformer';
import {
  CreatePostInput,
  PostFilter,
  PostOutput,
  UpdatePostInput,
} from '../dtos';
import { isEmpty } from '@nestjs/common/utils/shared.utils';
import { User } from '#entity/user/user.entity';
import { Category } from '#entity/post/category.entity';
import { Province } from '#entity/user/address/province.entity';
import { District } from '#entity/user/address/district.entity';
import { Ward } from '#entity/user/address/ward.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
    @InjectRepository(District)
    private districtRepository: Repository<District>,
    @InjectRepository(Ward)
    private wardRepository: Repository<Ward>,
  ) {}
  public async createNewPost(
    input: CreatePostInput,
    userId: string,
  ): Promise<BaseApiResponse<PostOutput>> {
    //find user creating post
    const user = await this.userRepo.findOne({
      where: {
        id: userId,
      },
      relations: ['province', 'district', 'ward'],
    });
    const inputValue: any = {};
    if (user) {
      inputValue['user'] = user;
    }
    //find category of post
    if (input.categoryId) {
      const category = await this.categoryRepo.findOne({
        where: {
          id: input.categoryId,
        },
      });
      if (category) {
        inputValue['category'] = category;
      }
    }
    //find post address
    if (input.provinceId && input.districtId && input.wardId) {
      const province = await this.provinceRepository.findOne({
        where: {
          id: input.provinceId,
        },
      });
      const district = await this.districtRepository.findOne({
        where: {
          id: input.districtId,
        },
      });
      const ward = await this.wardRepository.findOne({
        where: {
          id: input.wardId,
        },
      });
      //set full address of post
      if (province && district && ward) {
        inputValue[
          'fullAddress'
        ] = `${ward.level} ${ward.name}, ${district.level} ${district.name}, ${province.level} ${province.name}`;
      }
    } else {
      inputValue['provinceId'] = user?.province;
      inputValue['districtId'] = user?.district;
      inputValue['wardId'] = user?.ward;
      inputValue['fullAddress'] = user?.fullAddress;
    }
    //set specific address of post
    if (input.specificAddress) {
      inputValue['specificAddress'] = input.specificAddress;
    } else {
      inputValue['specificAddress'] = user?.specificAddress;
    }
    //save
    const post = await this.postRepo.save({
      ...input,
      user: inputValue.user,
      fullAddress: inputValue.fullAddress,
      category: inputValue.category,
      specificAddress: inputValue.specificAddress,
      provinceId: inputValue.provinceId,
      districtId: inputValue.districtId,
      wardId: inputValue.wardId,
    });
    //convert to output
    const postOutput = plainToClass(PostOutput, post, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: postOutput,
      message: MESSAGES.CREATED_SUCCEED,
      code: 0,
    };
  }

  public async updatePost(
    input: UpdatePostInput,
    postId: string,
  ): Promise<BaseApiResponse<PostOutput>> {
    //find post by id
    const postIdExist = await this.postRepo.findOne({
      where: {
        id: postId,
        deletedAt: IsNull(),
      },
      relations: ['user', 'category'],
    });
    if (!postIdExist) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.POST_NOT_FOUND,
        code: 4,
      });
    }
    //check data input to update
    if (input.description) {
      postIdExist.description = input.description;
    }
    if (input.imageURL) {
      postIdExist.imageURL = input.imageURL;
    }
    if (input.videoURL) {
      postIdExist.videoURL = input.videoURL;
    }
    if (input.provinceId && input.districtId && input.wardId) {
      postIdExist.provinceId = input.provinceId;
      postIdExist.districtId = input.districtId;
      postIdExist.wardId = input.wardId;
      const province = await this.provinceRepository.findOne({
        where: {
          id: input.provinceId,
        },
      });
      const district = await this.districtRepository.findOne({
        where: {
          id: input.districtId,
        },
      });
      const ward = await this.wardRepository.findOne({
        where: {
          id: input.wardId,
        },
      });
      if (province && district && ward) {
        postIdExist.fullAddress = `${ward.level} ${ward.name}, ${district.level} ${district.name}, ${province.level} ${province.name}`;
      }
    }
    if (input.specificAddress) {
      postIdExist.specificAddress = input.specificAddress;
    }
    if (input.categoryId) {
      const category = await this.categoryRepo.findOne({
        where: {
          id: input.categoryId,
        },
      });
      if (category) {
        postIdExist.category = category;
      }
    }
    if (typeof input.status === 'number') {
      if (input.status == 0) {
        postIdExist.status = POST_STATUS.IN_ACTIVE;
      }
      if (input.status == 1) {
        postIdExist.status = POST_STATUS.ACTIVE;
      }
    }
    //save
    const post = await this.postRepo.save(postIdExist);
    //convert to output
    const postOutput = plainToClass(PostOutput, post, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: postOutput,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }

  public async getAllPosts(
    filter: PostFilter,
  ): Promise<BasePaginationResponse<PostOutput>> {
    let wheres: any[] = [];
    const where: any = {
      id: Not(IsNull()),
      deletedAt: IsNull(),
    };
    if (typeof filter.status === 'number') {
      where['status'] = filter.status;
    }
    if (filter.keyword) {
      wheres = [
        {
          ...where,
          description: ILike(`%${filter.keyword}%`),
        },
      ];
    }
    if (isEmpty(wheres)) {
      wheres.push(where);
    }
    const posts = await this.postRepo.find({
      where: wheres,
      take: filter.limit,
      skip: filter.skip,
      order: {
        createdAt: 'DESC',
      },
      relations: ['user', 'category'],
    });
    const count = await this.postRepo.count({
      where: wheres,
      order: {
        createdAt: 'DESC',
      },
    });
    const postsOutput = plainToInstance(PostOutput, posts, {
      excludeExtraneousValues: true,
    });
    return {
      listData: postsOutput,
      total: count,
    };
  }

  public async getPostById(
    postId: string,
  ): Promise<BaseApiResponse<PostOutput>> {
    const post = await this.postRepo.findOne({
      where: { id: postId, deletedAt: IsNull() },
      relations: ['user', 'category'],
    });
    if (!post) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.POST_NOT_FOUND,
        code: 4,
      });
    }
    const postOutput = plainToClass(PostOutput, post, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: postOutput,
      message: MESSAGES.GET_SUCCEED,
      code: 0,
    };
  }

  public async deletePostPermanently(
    postId: string,
  ): Promise<BaseApiResponse<null>> {
    const post = await this.postRepo.findOne({
      where: { id: postId, deletedAt: Not(IsNull()) },
    });
    if (!post) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.POST_NOT_FOUND_IN_TRASH_BIN,
        code: 4,
      });
    }
    await this.postRepo.delete(postId);
    return {
      error: false,
      data: null,
      message: MESSAGES.DELETED_SUCCEED,
      code: 0,
    };
  }

  public async deletePost(
    postId: string,
    userId: string,
  ): Promise<BaseApiResponse<null>> {
    const post = await this.postRepo.findOne({
      where: { id: postId, deletedAt: IsNull() },
    });
    if (!post) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.POST_NOT_FOUND,
        code: 4,
      });
    }
    const myPost = await this.postRepo.findOne({
      where: { id: postId, deletedAt: IsNull(), user: { id: userId } },
    });
    if (!myPost) {
      throw new HttpException(
        {
          error: true,
          message: MESSAGES.CAN_NOT_DELETE_OTHER_USER_POST,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    post.deletedAt = new Date();
    await this.postRepo.save(post);
    return {
      error: false,
      data: null,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }

  public async restorePost(
    postId: string,
  ): Promise<BaseApiResponse<PostOutput>> {
    const post = await this.postRepo.findOne({
      where: { id: postId, deletedAt: Not(IsNull()) },
    });
    if (!post) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.POST_NOT_FOUND_IN_TRASH_BIN,
        code: 4,
      });
    }
    post.deletedAt = null;
    const updatedPost = await this.postRepo.save(post);
    const postOutput = plainToClass(PostOutput, updatedPost, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: postOutput,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }
}
