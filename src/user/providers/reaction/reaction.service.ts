import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '#entity/post/post.entity';
import { Repository } from 'typeorm';
import { User } from '#entity/user/user.entity';
import { Reaction, REACTION_TYPE } from '#entity/reaction.entity';
import {
  CreateReactionInput,
  ReactionFilter,
  ReactionOutput,
} from '@modules/user/dtos';
import {
  BaseApiResponse,
  ReactionPaginationResponse,
} from '@modules/shared/dtos';
import { MESSAGES } from '@modules/shared/constants';
import { plainToClass, plainToInstance } from 'class-transformer';

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
        message: MESSAGES.NOT_FOUND_USER,
        code: 4,
      });
    }
    const existUserReaction = await this.reactionRepo.findOne({
      where: {
        user: { id: userId },
        post: { id: input.postId },
      },
    });
    if (existUserReaction) {
      throw new HttpException(
        {
          error: true,
          message: MESSAGES.USER_REACTION_EXIST,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
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
      } else {
        throw new NotFoundException({
          error: true,
          message: MESSAGES.TYPE_NOT_FOUND,
          code: 4,
        });
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

  public async deleteReaction(
    reactionId: string,
    userId: string,
  ): Promise<BaseApiResponse<null>> {
    const myReaction = await this.reactionRepo.findOne({
      where: {
        user: { id: userId },
        id: reactionId,
      },
    });
    if (!myReaction) {
      throw new HttpException(
        {
          error: true,
          message: MESSAGES.CAN_NOT_DELETE_OTHER_USER_REACTION,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.reactionRepo.delete(reactionId);
    return {
      error: false,
      data: null,
      message: MESSAGES.DELETED_SUCCEED,
      code: 0,
    };
  }

  public async getReactionsByPostId(
    postId: string,
    filter: ReactionFilter,
  ): Promise<ReactionPaginationResponse<ReactionOutput>> {
    let query = 'r.id IS NOT NULL ';
    if (typeof filter.type === 'number') {
      query += `and r.type = ${filter.type} `;
    }
    const post = await this.postRepo
      .createQueryBuilder('p')
      .where(`p.id = '${postId}'`)
      .getOne();
    if (!post) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.POST_NOT_FOUND,
        code: 4,
      });
    }
    query += `and r.post_id = '${postId}'`;
    const reactions = await this.reactionRepo
      .createQueryBuilder('r')
      .select(['r.type AS type', 'u.username AS username'])
      .innerJoin('r.user', 'u')
      .where(query)
      .orderBy('r.created_at', 'DESC')
      .limit(filter.limit)
      .offset(filter.skip)
      .getRawMany();
    const count = await this.reactionRepo
      .createQueryBuilder('r')
      .select(['COUNT(r.id) AS count'])
      .innerJoin('r.user', 'u')
      .where(query)
      .getRawOne();
    const types = await this.reactionRepo
      .createQueryBuilder('r')
      .select('r.type AS type')
      .where(query)
      .groupBy('r.type')
      .getRawMany();
    const typeValues = types.map((item) => parseInt(item.type, 10));
    const reactionsOutput = plainToInstance(ReactionOutput, reactions, {
      excludeExtraneousValues: true,
    });
    return {
      listData: reactionsOutput,
      total: Number(count?.count) || 0,
      listType: typeValues,
    };
  }
}
