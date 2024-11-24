import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { Comment, COMMENT_STATUS } from '#entity/comment.entity';
import { Post } from '#entity/post/post.entity';
import { User } from '#entity/user/user.entity';
import { BaseApiResponse, BasePaginationResponse } from '../../../shared/dtos';
import {
  CommentFilter,
  CommentOutput,
  CreateCommentInput,
  UpdateCommentInput,
} from '../../dtos';
import { MESSAGES } from '../../../shared/constants';
import { plainToClass, plainToInstance } from 'class-transformer';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  public async createNewComment(
    input: CreateCommentInput,
    userId: string,
  ): Promise<BaseApiResponse<CommentOutput>> {
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
    
    //Parent Id is exist 
    if(input.parentId){
      input.level = input.parentLevel + 1;
    }else{
      input.level = 0;
    }

    const comment = await this.commentRepo.save({
      ...input,
      post: post,
      user: user,
    });
    const commentOutput = plainToClass(CommentOutput, comment, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: commentOutput,
      message: MESSAGES.CREATED_SUCCEED,
      code: 0,
    };
  }

  public async updateComment(
    input: UpdateCommentInput,
    commentId: string,
  ): Promise<BaseApiResponse<CommentOutput>> {
    const commentExist = await this.commentRepo.findOne({
      where: {
        id: commentId,
      },
    });
    if (!commentExist) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.COMMENT_NOT_FOUND,
        code: 4,
      });
    }
    //check data input to update
    if (input.description) {
      commentExist.description = input.description;
    }
    if (typeof input.status === 'number') {
      if (input.status == 0) {
        commentExist.status = COMMENT_STATUS.IN_ACTIVE;
      }
      if (input.status == 1) {
        commentExist.status = COMMENT_STATUS.ACTIVE;
      }
    }
    //save
    const updatedComment = await this.commentRepo.save(commentExist);
    //convert to output
    const commentOutput = plainToClass(CommentOutput, updatedComment, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: commentOutput,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }

  public async deleteComment(
    commentId: string,
    userId: string,
  ): Promise<BaseApiResponse<null>> {
    const commentExist = await this.commentRepo.findOne({
      where: {
        id: commentId,
      },
    });
    if (!commentExist) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.COMMENT_NOT_FOUND,
        code: 4,
      });
    }
    const myComment = await this.commentRepo.findOne({
      where: {
        id: commentId,
        user: { id: userId },
      },
    });
    if (!myComment) {
      throw new HttpException(
        {
          error: true,
          message: MESSAGES.CAN_NOT_DELETE_OTHER_USER_COMMENT,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.commentRepo.delete(commentId);
    return {
      error: false,
      data: null,
      message: MESSAGES.DELETED_SUCCEED,
      code: 0,
    };
  }

  public async getAllComments(
    filter: CommentFilter,
  ): Promise<BasePaginationResponse<CommentOutput>> {
    const where: any = {
      id: Not(IsNull()),
    };
    if (typeof filter.status === 'number') {
      where['status'] = filter.status;
    }
    if (filter.userKeyword) {
      const user = await this.userRepo.findOne({
        where: [
          {
            username: ILike(`%${filter.userKeyword}%`),
          },
          { email: ILike(`%${filter.userKeyword}%`) },
        ],
      });
      where['user'] = { id: user?.id };
    }
    if (filter.keyword) {
      where['description'] = filter.keyword;
    }
    const comments = await this.commentRepo.find({
      where: where,
      take: filter.limit,
      skip: filter.skip,
      order: {
        createdAt: 'DESC',
      },
      relations: ['user', 'post'],
    });
    const count = await this.commentRepo.count({
      where: where,
    });
    const commentsOutput = plainToInstance(CommentOutput, comments, {
      excludeExtraneousValues: true,
    });
    return {
      listData: commentsOutput,
      total: count,
    };
  }

  public async getRootCommentsByPostId(
    postId: string,
    filter: CommentFilter,
  ): Promise<BasePaginationResponse<CommentOutput>> {
    const post = await this.postRepo.findOne({
      where: {
        id: postId,
      },
    });
    if (!post) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.POST_NOT_FOUND,
        code: 4,
      });
    }
    const comments = await this.commentRepo.find({
      where: { post: { id: post.id }, status: COMMENT_STATUS.ACTIVE, level: 0 },
      take: filter.limit,
      skip: filter.skip,
      order: {
        createdAt: 'DESC',
      },
    });
    const count = await this.commentRepo.count({
      where: { post: { id: post.id }, status: COMMENT_STATUS.ACTIVE, level: 0 },
    });
    const commentsOutput = plainToInstance(CommentOutput, comments, {
      excludeExtraneousValues: true,
    });
    return {
      listData: commentsOutput,
      total: count,
    };
  }

  public async getChildCommentsByCommentId(
    parentId: string,
    filter: CommentFilter,
  ): Promise<BasePaginationResponse<CommentOutput>> {
    const comments = await this.commentRepo.find({
      where: { parentId: parentId, status: COMMENT_STATUS.ACTIVE},
      take: filter.limit,
      skip: filter.skip,
      order: {
        createdAt: 'DESC',
      },
    });
    const count = await this.commentRepo.count({
      where: { parentId: parentId, status: COMMENT_STATUS.ACTIVE },
    });
    const commentsOutput = plainToInstance(CommentOutput, comments, {
      excludeExtraneousValues: true,
    });
    return {
      listData: commentsOutput,
      total: count,
    };
  }

  public async getUserCommentsOnPost(
    postId: string,
    filter: CommentFilter,
    userId: string,
  ): Promise<BasePaginationResponse<CommentOutput>> {
    const post = await this.postRepo.findOne({
      where: {
        id: postId,
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
        message: MESSAGES.NOT_FOUND_USER,
        code: 4,
      });
    }
    const comments = await this.commentRepo.find({
      where: {
        post: { id: post.id },
        user: { id: user.id },
        status: COMMENT_STATUS.ACTIVE,
      },
      take: filter.limit,
      skip: filter.skip,
      order: {
        createdAt: 'DESC',
      },
      relations: ['user', 'post'],
    });
    const count = await this.commentRepo.count({
      where: {
        post: { id: post.id },
        user: { id: user.id },
        status: COMMENT_STATUS.ACTIVE,
      },
    });
    const commentsOutput = plainToInstance(CommentOutput, comments, {
      excludeExtraneousValues: true,
    });
    return {
      listData: commentsOutput,
      total: count,
    };
  }
}
