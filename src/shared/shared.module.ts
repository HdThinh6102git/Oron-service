import { forwardRef, Module } from '@nestjs/common';
import * as providers from './providers';
import * as controllers from './controllers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '#entity/user/user.entity';
import { Verification } from '#entity/user/verification.entity';
import { AuthModule } from '../auth';
import { Role } from '#entity/user/role.entity';
import { UserModule } from '../user';
import { PostService } from '../post/providers';
import { Post } from '#entity/post/post.entity';
import { Category } from '#entity/post/category.entity';
import { Province } from '#entity/user/address/province.entity';
import { District } from '#entity/user/address/district.entity';
import { Ward } from '#entity/user/address/ward.entity';
import { Comment } from '#entity/comment.entity';
import { Reaction } from '#entity/reaction.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Verification,
      Role,
      Post,
      Category,
      Province,
      District,
      Ward,
      Comment,
      Reaction,
    ]),
    forwardRef(() => AuthModule),
    UserModule,
  ],
  controllers: Object.values(controllers),
  providers: [...Object.values(providers), PostService],
  exports: Object.values(providers),
})
export class SharedModule {}
