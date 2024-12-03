import { Module } from '@nestjs/common';
import * as controllers from './controllers';
import * as providers from './providers';
import { AuthModule } from '../auth';
import { SharedModule } from 'src/shared/shared.module';
@Module({
    imports: [
      AuthModule,
      SharedModule,
    ],
    controllers: Object.values(controllers),
    providers: Object.values(providers),
    exports: Object.values(providers),
  })
  export class GoogleDriveModule {}