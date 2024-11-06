import { Module } from '@nestjs/common';
import * as controllers from './controllers';
import * as providers from './providers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth';
import { AdvertisementBanner } from '#entity/advertisement_banner/advertisement-banner.entity';
import { AdvertismentPosition } from '#entity/advertisement_banner/advertisement-position.entity';
@Module({
    imports: [
      TypeOrmModule.forFeature([
        AdvertisementBanner,
        AdvertismentPosition
      ]),
      AuthModule,
    ],
    controllers: Object.values(controllers),
    providers: Object.values(providers),
    exports: Object.values(providers),
  })
  export class AdvertisementBannerModule {}