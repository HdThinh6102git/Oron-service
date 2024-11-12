import { TypeOrmModule } from "@nestjs/typeorm";
import * as controllers from './controllers';
import * as providers from './providers';
import { Module } from '@nestjs/common';
import { FcmToken, Notification } from "#entity/index";
import { AuthModule } from "src/auth";
@Module({
    imports: [
      TypeOrmModule.forFeature([
        FcmToken,
        Notification
      ]),
      AuthModule,
    ],
    controllers: Object.values(controllers),
    providers: Object.values(providers),
    exports: Object.values(providers),
  })
  export class NotificationModule {}