import { Module } from '@nestjs/common';
import * as controllers from './controllers';
import * as providers from './providers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth';
import { AdvertisementBanner, AdvertismentPosition, Client, RentalContract } from '#entity/advertisement_banner';
@Module({
    imports: [
      TypeOrmModule.forFeature([
        AdvertisementBanner,
        AdvertismentPosition,
        Client,
        RentalContract
      ]),
      AuthModule,
    ],
    controllers: Object.values(controllers),
    providers: Object.values(providers),
    exports: Object.values(providers),
  })
  export class AdvertisementBannerModule {}