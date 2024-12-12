import { Global, Module, NestModule } from '@nestjs/common';
// MiddlewareConsumer, 
// import { LoggerContextMiddleware } from './middleware';
import * as providers from '@modules/common/providers';

const services = Object.values(providers);

@Global()
@Module({
  providers: services,
  exports: services,
})
export class CommonModule implements NestModule {
  // Global Middleware
  public configure(): void {
    // consumer: MiddlewareConsumer
    // consumer.apply(LoggerContextMiddleware).forRoutes('*');
  }
}
