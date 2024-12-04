import { Module } from '@nestjs/common';
import * as controllers from './controllers';
import * as providers from './providers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../entity/post/post.entity';
import { Category } from '../entity/post/category.entity';
import { User } from '../entity/user/user.entity';
import { AuthModule } from '../auth';
import { Province } from '#entity/user/address/province.entity';
import { District } from '#entity/user/address/district.entity';
import { Ward } from '#entity/user/address/ward.entity';
import { Comment } from '#entity/comment.entity';
import { Reaction } from '#entity/reaction.entity';
import { SavedPost } from '#entity/post/saved-post.entity';
import { PostRegistration } from '#entity/post-registration.entity';
import { Review } from '#entity/review.entity';
import { UserConnection } from '#entity/user/user-connection.entity';
import { FileRelatedMorph, File } from '#entity/file';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      Category,
      User,
      Province,
      District,
      Ward,
      Comment,
      Reaction,
      SavedPost,
      PostRegistration,
      Review,
      UserConnection,
      File, 
      FileRelatedMorph
    ]),
    AuthModule,
  ],
  controllers: Object.values(controllers),
  providers: Object.values(providers),
  exports: Object.values(providers),
})
export class PostModule {}
