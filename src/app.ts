import { Logger as NestLogger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { middleware } from './app.middleware';
import { AppModule } from './app.module';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import type { NestExpressApplication } from '@nestjs/platform-express';

/**
 * https://docs.nestjs.com
 * https://github.com/nestjs/nest/tree/master/sample
 */
async function bootstrap(): Promise<string> {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // for http
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  if (isProduction) {
    app.enable('trust proxy');
  }
  app.enableCors();
  // Express Middleware
  app.useStaticAssets(join(__dirname, '../uploads'));
  middleware(app);
  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.PORT || 3500);
  return app.getUrl();
}

(async (): Promise<void> => {
  try {
    const url = await bootstrap();
    NestLogger.log(url, 'Bootstrap');
  } catch (error) {
    NestLogger.error(error, 'Bootstrap');
  }
})();
