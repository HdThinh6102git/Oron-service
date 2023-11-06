import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '#entity/post/post.entity';
import { Repository } from 'typeorm';
import { User } from '#entity/user/user.entity';
import { Reaction, REACTION_TYPE } from '#entity/reaction.entity';
import { CreateReactionInput, ReactionOutput } from '../../dtos';
import { BaseApiResponse } from '../../../shared/dtos';
import { MESSAGES } from '../../../shared/constants';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ReactionService {
  constructor(
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Reaction)
    private reactionRepo: Repository<Reaction>,
  ) {}

  public async createNewReaction(
    input: CreateReactionInput,
    userId: string,
  ): Promise<BaseApiResponse<ReactionOutput>> {
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
    let type;
    if (typeof input.type === 'number') {
      if (input.type == 0) {
        type = REACTION_TYPE.LIKE;
      } else if (input.type == 1) {
        type = REACTION_TYPE.HEART;
      } else if (input.type == 2) {
        type = REACTION_TYPE.HAHA;
      } else if (input.type == 3) {
        type = REACTION_TYPE.ANGRY;
      }
    }
    const reaction = await this.reactionRepo.save({
      ...input,
      post: post,
      user: user,
      type: type,
    });
    const reactionOutput = plainToClass(ReactionOutput, reaction, {
      excludeExtraneousValues: true,
    });
    reactionOutput.username = user.username;
    return {
      error: false,
      data: reactionOutput,
      message: MESSAGES.CREATED_SUCCEED,
      code: 0,
    };
  }
}
