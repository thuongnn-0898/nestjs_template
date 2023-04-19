import { NestFactory, Reflector } from '@nestjs/core';
import helmet from 'helmet';
import {
  ValidationPipe,
  HttpStatus,
  UnprocessableEntityException,
  RequestMethod,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule } from 'nest-winston';
import { json } from 'body-parser';
import * as passport from 'passport';
import * as session from 'express-session';

import { AppModule } from './app.module';
import { SharedModule } from './shared/share.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { UnprocessableFilter } from './filters/bad-request.filter';
import { QueryFailedFilter } from './filters/query-failed.filter';
import { loggerOption } from './logger/logger.option';
import { ProcessLogger } from './logger/process.logger';
import { setupSwagger } from './setup-swagger';
import { cookieOption, sessionConfig } from './constants';

async function bootstrap() {
  const jsonParseMiddleware = json({ limit: '50mb' });
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    logger: WinstonModule.createLogger(loggerOption),
  });

  app.use(helmet());
  app.use(jsonParseMiddleware);
  app.enableCors({ credentials: true });

  app.use(
    session({
      secret: sessionConfig.secret,
      resave: false,
      saveUninitialized: false,
      cookie: cookieOption,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const reflector = app.get(Reflector);

  app.useGlobalFilters(
    new UnprocessableFilter(reflector),
    new QueryFailedFilter(reflector),
  );
  app.useGlobalInterceptors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );
  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: '/auth/:splat*', method: RequestMethod.ALL }],
  });

  ProcessLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const configService = app.select(SharedModule).get(ApiConfigService);

  if (configService.documentationEnabled) {
    setupSwagger(app);
  }

  const port = configService.appConfig.port;
  await app.listen(port);
}

void bootstrap();
