import { TypeOrmModule } from "@nestjs/typeorm";
import * as controllers from '@modules/notification/controllers';
import * as providers from '@modules/notification/providers';
import { Module } from '@nestjs/common';
import { FcmToken, File, FileRelatedMorph, Notification, User } from "#entity/index";
import { AuthModule } from "@modules/auth";
import { FileService, } from "@modules/shared/providers";
@Module({
    imports: [
      TypeOrmModule.forFeature([
        FcmToken,
        Notification,
        User,
        File,
        FileRelatedMorph
      ]),
      AuthModule,
    ],
    controllers: Object.values(controllers),
    providers: [...Object.values(providers), FileService],
    exports: Object.values(providers),
  })
export class NotificationModule {}