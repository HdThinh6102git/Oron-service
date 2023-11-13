import { Module } from '@nestjs/common';
import * as controllers from './controllers';
import * as providers from './providers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRegistration } from '#entity/post-registration.entity';
import { AuthModule } from '../auth';
import { Post } from '#entity/post/post.entity';
import { User } from '#entity/user/user.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([PostRegistration, Post, User]),
  ],
  controllers: Object.values(controllers),
  providers: Object.values(providers),
  exports: Object.values(providers),
})
export class PostRegistrationModule {}
