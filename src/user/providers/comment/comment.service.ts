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
import { BaseApiResponse, BasePaginationResponse} from '../../../shared/dtos';
import {
  CommentFilter,
  CommentOutput,
  CommentUserOutputDto,
  CreateCommentInput,
  UpdateCommentInput,
} from '../../dtos';
import { MESSAGES } from '../../../shared/constants';
import { plainToClass, plainToInstance } from 'class-transformer';
import { RELATED_TYPE } from '#entity/file';
import { FileService } from 'src/shared/providers';

@Injectable()
export class CommentService {
  constructor(
    private fileService: FileService,
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

    input.createBy = userId;
    input.modifyBy = userId;
    input.sysFlag = '1';
    const comment = await this.commentRepo.save({
      ...input,
      post: post,
      user: user,
    });
    //convert output
    const commentOutput = plainToClass(CommentOutput, comment, {
      excludeExtraneousValues: true,
    });
    //get user profile picture 
    const imageProfileObject = await this.fileService.getRelatedFile(userId, RELATED_TYPE.USER_PROFILE);
    if(imageProfileObject){
      commentOutput.user.profilePic = imageProfileObject;
    }
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
    userId: string,
  ): Promise<BaseApiResponse<CommentOutput>> {
    const commentExist = await this.commentRepo.findOne({
      where: {
        id: commentId,
        sysFlag: '1'
      },
    });
    if (!commentExist) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.COMMENT_NOT_FOUND,
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
    //check data input to update
    if (input.description) {
      commentExist.description = input.description;
    }
    if (typeof input.status === 'number') {
      if (input.status == 0) {
        commentExist.status = COMMENT_STATUS.IN_ACTIVE; // Hide the comment by owner 
      }
      if (input.status == 1) {
        commentExist.status = COMMENT_STATUS.ACTIVE; 
      }
    }
    //save
    commentExist.modifyBy = userId;
    const updatedComment = await this.commentRepo.save(commentExist);
    
    //convert to output
    const commentOutput = plainToClass(CommentOutput, updatedComment, {
      excludeExtraneousValues: true,
    });

    //get user info 
    const userOutput = plainToClass(CommentUserOutputDto, user, {
      excludeExtraneousValues: true,
    });
    commentOutput.user = userOutput

    //get user profile picture 
    const imageProfileObject = await this.fileService.getRelatedFile(userId, RELATED_TYPE.USER_PROFILE);
    if(imageProfileObject){
      commentOutput.user.profilePic = imageProfileObject;
    }

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
    
    const myComment = await this.commentRepo.findOne({
      where: {
        id: commentId,
        user: { id: userId },
        sysFlag: '1'
      },
    });
    if (!myComment) {
      throw new HttpException(
        {
          error: true,
          message: MESSAGES.COMMENT_NOT_FOUND,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    //Soft delete
    myComment.sysFlag = '0';
    myComment.updatedAt = new Date();
    myComment.modifyBy = userId;
    await this.commentRepo.save(myComment);
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
      sysFlag: '1'
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
      where: { post: { id: post.id }, status: COMMENT_STATUS.ACTIVE, level: 0, sysFlag: '1' },
      take: filter.limit,
      skip: filter.skip,
      order: {
        createdAt: 'DESC',
      },
      relations: ['user'],
    });
  
    const count = await this.commentRepo.count({
      where: { post: { id: post.id }, status: COMMENT_STATUS.ACTIVE, level: 0 },
    });
    const commentsOutput = plainToInstance(CommentOutput, comments, {
      excludeExtraneousValues: true,
    });

    // Loop comment out put then find the total child comment and oldest comment's owner
    for (const comment of commentsOutput) {
      // find the total  child comments
      const childCount = await this.commentRepo.count({
        where: { parentId: comment.id, status: COMMENT_STATUS.ACTIVE, sysFlag: '1' },
      });
    
      // find  userId of oldest child comment 
      const oldestChild = await this.commentRepo.findOne({
        where: { parentId: comment.id, status: COMMENT_STATUS.ACTIVE, sysFlag: '1' },
        order: { createdAt: 'ASC' },
      });
      // assign 
      if(oldestChild){
        const user = await this.userRepo.findOne({
          where: {
            id: oldestChild.createBy
          }
        })
        if(user){
          comment.oldestChildOwnerName = user.name;
        } 
      }else{
        comment.oldestChildOwnerName = "";
      }
      comment.totalChild = childCount;

      //get user profile pic 
      const imageProfileObject = await this.fileService.getRelatedFile(comment.userId, RELATED_TYPE.USER_PROFILE);
      if(imageProfileObject){
        comment.user.profilePic = imageProfileObject;
      }
    }
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
      where: { parentId: parentId, status: COMMENT_STATUS.ACTIVE, sysFlag: '1'},
      take: filter.limit,
      skip: filter.skip,
      order: {
        createdAt: 'DESC',
      },
      relations: ['user'],
    });
    const count = await this.commentRepo.count({
      where: { parentId: parentId, status: COMMENT_STATUS.ACTIVE },
    });
    const commentsOutput = plainToInstance(CommentOutput, comments, {
      excludeExtraneousValues: true,
    });
    // Loop comment out put then find the total child comment and oldest comment's owner
    for (const comment of commentsOutput) {
      // find the total  child comments
      const childCount = await this.commentRepo.count({
        where: { parentId: comment.id, status: COMMENT_STATUS.ACTIVE, sysFlag: '1' },
      });
    
      // find  userId of oldest hild comment 
      const oldestChild = await this.commentRepo.findOne({
        where: { parentId: comment.id, status: COMMENT_STATUS.ACTIVE, sysFlag: '1' },
        order: { createdAt: 'ASC' },
      });
      // assign 
      if(oldestChild){
        const user = await this.userRepo.findOne({
          where: {
            id: oldestChild.createBy
          }
        })
        if(user){
          comment.oldestChildOwnerName = user.name;
        } 
      }else{
        comment.oldestChildOwnerName = "";
      }
      comment.totalChild = childCount;
      //get user profile pic 
      const imageProfileObject = await this.fileService.getRelatedFile(comment.userId, RELATED_TYPE.USER_PROFILE);
      if(imageProfileObject){
        comment.user.profilePic = imageProfileObject;
      }
    }
    
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
