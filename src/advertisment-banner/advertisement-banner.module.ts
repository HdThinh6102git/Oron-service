import { Module } from '@nestjs/common';
import * as controllers from './controllers';
import * as providers from './providers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth';
@Module({
    imports: [
      TypeOrmModule.forFeature([
        
      ]),
      AuthModule,
    ],
    controllers: Object.values(controllers),
    providers: Object.values(providers),
    exports: Object.values(providers),
  })
  export class AdvertisementBannerModule {}