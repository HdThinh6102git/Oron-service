import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '#entity/user/user.entity';
import { Role } from '#entity/user/role.entity';
import { Permission } from '#entity/user/permission.entity';
import * as controllers from './controllers';
import * as providers from './providers';
import { Province } from '#entity/user/address/province.entity';
import { District } from '#entity/user/address/district.entity';
import { Ward } from '#entity/user/address/ward.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Comment } from '#entity/comment.entity';
import { Review } from '#entity/review.entity';
import { Reaction } from '#entity/reaction.entity';
import { Post } from '#entity/post/post.entity';
import { PostRegistration } from '#entity/post-registration.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        global: true,
        publicKey: configService.get<string>('jwt.publicKey'),
        privateKey: configService.get<string>('jwt.privateKey'),
        signOptions: {
          algorithm: 'RS256',
          issuer: 'AuthService',
          expiresIn: configService.get<string>('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission,
      Province,
      District,
      Ward,
      Comment,
      Review,
      Reaction,
      Post,
      PostRegistration,
    ]),
  ],
  controllers: Object.values(controllers),
  providers: Object.values(providers),
  exports: Object.values(providers),
})
export class UserModule {}
