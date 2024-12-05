import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, IsNull, Not, Repository } from 'typeorm';
import {
  FINAL_POST_REGISTRATION_STATUS,
  Post,
  POST_STATUS,
} from '#entity/post/post.entity';
import { BaseApiResponse, BasePaginationResponse, FileOutput } from '../../shared/dtos';
import { MESSAGES } from '../../shared/constants';
import { plainToClass, plainToInstance } from 'class-transformer';
import {
  CreatePostInput,
  PostFilter,
  PostOutput,
  SavedPostOutput,
  UpdatePostInput,
} from '../dtos';
import { isEmpty } from '@nestjs/common/utils/shared.utils';
import { User } from '#entity/user/user.entity';
import { Category } from '#entity/post/category.entity';
import { Province } from '#entity/user/address/province.entity';
import { District } from '#entity/user/address/district.entity';
import { Ward } from '#entity/user/address/ward.entity';
import { Comment } from '#entity/comment.entity';
import { Reaction } from '#entity/reaction.entity';
import { SavedPost } from '#entity/post/saved-post.entity';
import { SavedPostFilter } from '../dtos/saved-post-filter.dto';
import {
  POST_REGISTRATION_STATUS,
  PostRegistration,
} from '#entity/post-registration.entity';
import { ReactionOutput, UserOutputDto } from '../../user/dtos';
import { Review } from '#entity/review.entity';
import { UserConnection } from '#entity/user/user-connection.entity';
import { FileRelatedMorph, File } from '#entity/file';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,
    @InjectRepository(Reaction)
    private reactionRepo: Repository<Reaction>,
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
    @InjectRepository(SavedPost)
    private savedPostRepo: Repository<SavedPost>,
    @InjectRepository(PostRegistration)
    private postRegistrationRepo: Repository<PostRegistration>,
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,
    @InjectRepository(UserConnection)
    private userConnectionRepo: Repository<UserConnection>,
    @InjectRepository(File)
    private fileRepo: Repository<File>,
    @InjectRepository(FileRelatedMorph)
    private fileRelatedMorphRepo: Repository<FileRelatedMorph>,
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
    if (!user) {
      throw new NotFoundException({
        error: true,
        data: null,
        message: MESSAGES.NOT_FOUND_USER,
        code: 4,
      });
    }
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
        inputValue['provinceId'] = input.provinceId;
        inputValue['districtId'] = input.districtId;
        inputValue['wardId'] = input.wardId;
        inputValue[
          'fullAddress'
        ] = `${ward.level} ${ward.name}, ${district.level} ${district.name}, ${province.level} ${province.name}`;
      }
    } else {
      inputValue['provinceId'] = user?.province.id;
      inputValue['districtId'] = user?.district.id;
      inputValue['wardId'] = user?.ward.id;
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
    modifyBy: string,
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
        postIdExist.status = input.status
    }
    postIdExist.modifyBy = modifyBy;
    //save
    const post = await this.postRepo.save(postIdExist);
    //convert to output
    const totalComments = await this.commentRepo.count({
      where: {
        post: { id: postId },
      },
    });
    const totalReactions = await this.reactionRepo.count({
      where: {
        post: { id: postId },
      },
    });
    const postOutput = plainToClass(PostOutput, post, {
      excludeExtraneousValues: true,
    });
    postOutput.totalComments = totalComments;
    postOutput.totalReactions = totalReactions;
    return {
      error: false,
      data: postOutput,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }

  public async getPosts(
    filter: PostFilter,
    userId: string,
  ): Promise<BasePaginationResponse<PostOutput>> {
    let wheres: any[] = [];
    const where: any = {
      id: Not(IsNull()),
      deletedAt: IsNull(),
    };
    if (typeof filter.status === 'number') {
      if (!filter.friends) {
        where['status'] = filter.status;
      }
    }
    if (typeof filter.registration_status === 'number') {
      if (
        filter.registration_status ==
        POST_REGISTRATION_STATUS.WAITING_CONFIRMATION
      ) {
        const postRegistrations = await this.postRegistrationRepo.find({
          where: {
            status: POST_REGISTRATION_STATUS.WAITING_CONFIRMATION,
          },
          relations: ['post'],
        });
        const postIds = postRegistrations.map(
          (postRegistration) => postRegistration.post.id,
        );
        where['id'] = In(postIds);
        where['finalRegistrationStatus'] =
          FINAL_POST_REGISTRATION_STATUS.AVAILABLE;
      }
    }
    if (filter.userId) {
      if (filter.friends) {
        const firstFriendIdsArray = await this.userConnectionRepo
          .createQueryBuilder('userConnection')
          .select('userConnection.followed_id')
          .where('userConnection.follower_id = :userId', {
            userId: filter.userId,
          })
          .andWhere('userConnection.type = 1')
          .getRawMany();
        const firstFriendIdValuesArray = firstFriendIdsArray.map(
          (item) => item.followed_id,
        );
        const secondFriendIdsArray = await this.userConnectionRepo
          .createQueryBuilder('userConnection')
          .select('userConnection.follower_id')
          .where('userConnection.followed_id = :userId', {
            userId: filter.userId,
          })
          .andWhere('userConnection.type = 1')
          .getRawMany();
        const secondFriendIdValuesArray = secondFriendIdsArray.map(
          (item) => item.follower_id,
        );
        const allFriendIdsArray = [
          ...firstFriendIdValuesArray,
          ...secondFriendIdValuesArray,
        ];
        const followingNotFriendIdsArray = await this.userConnectionRepo
          .createQueryBuilder('userConnection')
          .select('userConnection.followed_id')
          .where('userConnection.follower_id = :userId', {
            userId: filter.userId,
          })
          .andWhere('userConnection.type = 0')
          .getRawMany();
        const followingNotFriendIdValuesArray = followingNotFriendIdsArray.map(
          (item) => item.followed_id,
        );
        const allFollowingIdsArray = [
          ...allFriendIdsArray,
          ...followingNotFriendIdValuesArray,
        ];
        where['user'] = { id: In(allFollowingIdsArray) };
        const statusPostArr = [POST_STATUS.FRIEND, POST_STATUS.PUBLIC];
        where['status'] = In(statusPostArr);
      } else {
        where['user'] = { id: filter.userId };
      }
    }
    if (filter.categoryId) {
      where['category'] = { id: filter.categoryId };
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
    console.log(posts)
    const count = await this.postRepo.count({
      where: wheres,
      order: {
        createdAt: 'DESC',
      },
    });
    const postsOutput = plainToInstance(PostOutput, posts, {
      excludeExtraneousValues: true,
    });
    for (let i = 0; i < postsOutput.length; i++) {
      const totalComments = await this.commentRepo.count({
        where: {
          post: { id: postsOutput[i].id },
          sysFlag: '1'
        },
      });
      const totalReactions = await this.reactionRepo.count({
        where: {
          post: { id: postsOutput[i].id },
        },
      });
      const currentUserReaction = await this.reactionRepo.findOne({
        where: {
          post: { id: postsOutput[i].id },
          user: { id: userId },
        },
      });
      const postReview = await this.reviewRepo.findOne({
        where: {
          post: { id: postsOutput[i].id },
        },
        relations: ['user'],
      });
      if (postReview) {
        const reviewer = plainToInstance(UserOutputDto, postReview.user, {
          excludeExtraneousValues: true,
        });
        postsOutput[i].reviewStar = postReview.numberStar;
        postsOutput[i].reviewer = reviewer;
      } else {
        postsOutput[i].reviewStar = 0;
        postsOutput[i].reviewer = null;
      }
      const currentUserReactionOutput = plainToInstance(
        ReactionOutput,
        currentUserReaction,
        {
          excludeExtraneousValues: true,
        },
      );
      if (posts[i].receiverId === userId) {
        postsOutput[i].isUserReceived = true;
      } else {
        postsOutput[i].isUserReceived = false;
      }
      postsOutput[i].currentUserReaction = currentUserReactionOutput;
      postsOutput[i].totalComments = totalComments;
      postsOutput[i].totalReactions = totalReactions;
      //Get fileRid related file data
      const fileRelatedMorphs = await this.fileRelatedMorphRepo.find({
        where: {
          relatedRid: postsOutput[i].id,
          sysFlag: '1'
        },
      });
      // Extract file IDs
      const fileRids = fileRelatedMorphs.map((morph) => morph.fileRid);
      // Fetch all files in one query
      const files = await this.fileRepo.find({
        where: {
          id: In(fileRids),
          sysFlag: '1',
        },
      });
      // Get files url 
      const imageArray = files.map((file) =>
        plainToInstance(FileOutput, {
          url: file.url,
          alternativeText: file.alternativeText,
        }),
      );
      postsOutput[i].image = imageArray;
    }
    return {
      listData: postsOutput,
      total: count,
    };
  }

  public async getPostById(
    postId: string,
    userId: string,
  ): Promise<BaseApiResponse<PostOutput>> {
    const post = await this.postRepo.findOne({
      where: { id: postId, deletedAt: IsNull() },
      relations: ['user', 'category'],
    });
    //Get related creator data
    
    if (!post) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.POST_NOT_FOUND,
        code: 4,
      });
    }

    const totalComments = await this.commentRepo.count({
      where: {
        post: { id: postId },
        sysFlag: '1'
      },
    });
    const totalReactions = await this.reactionRepo.count({
      where: {
        post: { id: postId },
      },
    });
    const postReview = await this.reviewRepo.findOne({
      where: {
        post: { id: post.id },
      },
      relations: ['user'],
    });
    const postOutput = plainToClass(PostOutput, post, {
      excludeExtraneousValues: true,
    });
    if (postReview) {
      const reviewer = plainToInstance(UserOutputDto, postReview.user, {
        excludeExtraneousValues: true,
      });
      postOutput.reviewStar = postReview.numberStar;
      postOutput.reviewer = reviewer;
    } else {
      postOutput.reviewStar = 0;
      postOutput.reviewer = null;
    }
    const currentUserReaction = await this.reactionRepo.findOne({
      where: {
        post: { id: postOutput.id },
        user: { id: userId },
      },
    });
    //Get fileRid related file data
    const fileRelatedMorphs = await this.fileRelatedMorphRepo.find({
      where: {
        relatedRid: postId,
        sysFlag: '1'
      },
    });
    // Extract file IDs
    const fileRids = fileRelatedMorphs.map((morph) => morph.fileRid);
    // Fetch all files in one query
    const files = await this.fileRepo.find({
      where: {
        id: In(fileRids),
        sysFlag: '1',
      },
    });
    // Get files
    const imageArray = files.map((file) =>
      plainToInstance(FileOutput, {
        url: file.url,
        alternativeText: file.alternativeText,
      }),
    );
    
    const currentUserReactionOutput = plainToInstance(
      ReactionOutput,
      currentUserReaction,
      {
        excludeExtraneousValues: true,
      },
    );
    if (post.receiverId === userId) {
      postOutput.isUserReceived = true;
    } else {
      postOutput.isUserReceived = false;
    }
    postOutput.currentUserReaction = currentUserReactionOutput;
    postOutput.totalComments = totalComments;
    postOutput.totalReactions = totalReactions;
    postOutput.image = imageArray;
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

  public async updateImgUrl(
    imgUrl: string,
    userId: string,
    postId: string,
  ): Promise<BaseApiResponse<PostOutput>> {
    const userExist = await this.userRepo.findOne({
      where: {
        id: userId,
      },
    });
    if (!userExist) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.NOT_FOUND_USER,
        code: 4,
      });
    }
    const postExist = await this.postRepo.findOne({
      where: {
        id: postId,
      },
    });
    if (!postExist) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.POST_NOT_FOUND,
        code: 4,
      });
    }
    if (imgUrl) {
      postExist.imageURL = imgUrl;
    }
    const updatedPost = await this.postRepo.save(postExist);
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

  public async savePost(
    userId: string,
    postId: string,
  ): Promise<BaseApiResponse<SavedPostOutput>> {
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
    const post = await this.postRepo.findOne({
      where: {
        id: postId,
      },
    });
    if (!post) {
      throw new NotFoundException({
        error: true,
        data: null,
        message: MESSAGES.POST_NOT_FOUND,
        code: 4,
      });
    }
    const savedPostExist = await this.savedPostRepo.findOne({
      where: {
        user: { id: userId },
        post: { id: postId },
      },
    });
    if (savedPostExist) {
      throw new HttpException(
        {
          error: true,
          message: MESSAGES.USER_SAVED_THIS_POST,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const savedPost = await this.savedPostRepo.save({
      post: post,
      user: user,
    });
    //convert to output
    const savedPostOutput = plainToClass(SavedPostOutput, savedPost, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: savedPostOutput,
      message: MESSAGES.CREATED_SUCCEED,
      code: 0,
    };
  }

  public async unSavePost(
    userId: string,
    postId: string,
  ): Promise<BaseApiResponse<null>> {
    const savedPost = await this.savedPostRepo.findOne({
      where: {
        user: { id: userId },
        post: { id: postId },
      },
    });
    if (!savedPost) {
      throw new NotFoundException({
        error: true,
        data: null,
        message: MESSAGES.POST_NOT_SAVED,
        code: 4,
      });
    }
    await this.savedPostRepo.delete(savedPost.id);
    return {
      error: false,
      data: null,
      message: MESSAGES.DELETED_SUCCEED,
      code: 0,
    };
  }

  public async getSavedPostsByUserId(
    userId: string,
    filter: SavedPostFilter,
  ): Promise<BasePaginationResponse<PostOutput>> {
    const wherePost: any = {
      id: Not(IsNull()),
    };
    const postFilterIdsArray = [];
    if (filter.categoryId) {
      wherePost['category'] = { id: filter.categoryId };
    }
    if (filter.keyword) {
      wherePost['description'] = ILike(`%${filter.keyword}%`);
    }
    let savedPosts: any = [];
    if (filter.savedAt) {
      savedPosts = await this.savedPostRepo
        .createQueryBuilder('sp')
        .leftJoinAndSelect('sp.post', 'post')
        .where(`sp.user_id = :userId`, { userId: userId })
        .andWhere(`TO_CHAR(sp.created_at::DATE, 'yyyy-mm-dd') = :savedAt`, {
          savedAt: filter.savedAt,
        })
        .getMany();
    } else {
      savedPosts = await this.savedPostRepo
        .createQueryBuilder('sp')
        .leftJoinAndSelect('sp.post', 'post')
        .where(`sp.user_id = :userId`, { userId: userId })
        .getMany();
    }
    for (const savedPost of savedPosts) {
      postFilterIdsArray.push(savedPost.post.id);
    }
    wherePost['id'] = In(postFilterIdsArray);
    const posts = await this.postRepo.find({
      where: wherePost,
      take: filter.limit,
      skip: filter.skip,
      order: {
        createdAt: 'DESC',
      },
      relations: ['user'],
    });
    const count = await this.postRepo.count({
      where: wherePost,
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
}
