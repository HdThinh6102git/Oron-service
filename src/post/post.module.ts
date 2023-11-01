import { Module } from '@nestjs/common';
import * as controllers from './controllers';
import * as providers from './providers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../entity/post/post.entity';
import { Category } from '../entity/post/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Category])],
  controllers: Object.values(controllers),
  providers: Object.values(providers),
  exports: Object.values(providers),
})
export class PostModule {}
