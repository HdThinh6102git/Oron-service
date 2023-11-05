import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '#entity/comment.entity';
import { Post } from '#entity/post/post.entity';
import { User } from '#entity/user/user.entity';
import { BaseApiResponse } from '../../../shared/dtos';
import { CommentOutput, CreateCommentInput } from '../../dtos';
import { MESSAGES } from '../../../shared/constants';
import { plainToClass } from 'class-transformer';

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
}
