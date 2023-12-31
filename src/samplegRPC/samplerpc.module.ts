import { Module } from '@nestjs/common';
import * as controllers from './controllers';
import * as providers from './providers';

@Module({
  imports: [],
  controllers: Object.values(controllers),
  providers: Object.values(providers),
})
export class SampleRPCModule {}
