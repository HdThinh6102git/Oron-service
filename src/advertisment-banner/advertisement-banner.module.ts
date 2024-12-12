import { Module } from '@nestjs/common';
import * as controllers from '@modules/advertisment-banner/controllers';
import * as providers from '@modules/advertisment-banner/providers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@modules/auth';
import { AdvertisementBanner, AdvertismentPosition, Client, RentalContract } from '#entity/advertisement_banner';
import { FileService } from '@modules/shared/providers';
import { FileRelatedMorph, File } from '@modules/entity';
@Module({
    imports: [
      TypeOrmModule.forFeature([
        AdvertisementBanner,
        AdvertismentPosition,
        Client,
        RentalContract,
        FileRelatedMorph,
        File
      ]),
      AuthModule,
    ],
    controllers: Object.values(controllers),
    providers: [...Object.values(providers), FileService],
    exports: Object.values(providers),
  })
  export class AdvertisementBannerModule {}