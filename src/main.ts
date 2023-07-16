import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { Logger, LOG_LEVEL } from './logger';

const logger = new Logger('main', LOG_LEVEL.DEBUG);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger,
  });

  app.disable('x-powered-by');
  app.set('trust proxy', process.env.NODE_ENV === 'production');

  app.enableCors({
    origin:      true,
    methods:     'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(3000);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async (): Promise<void> => {
  try {
    await bootstrap();

    logger.log('Server started successfully');
  } catch ({ name, message, stack }) {
    logger.error(`${name}: ${message}\n${stack}`);
  }
})();
