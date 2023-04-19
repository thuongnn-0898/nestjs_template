import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as passport from 'passport';
import * as session from 'express-session';
import RedisStore from 'connect-redis';
import { RedisModule } from './modules/redis/redis.module';

import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/share.module';
import { RequestLoggerMiddleware } from './middlewares/request-logger.middleware';
import { AsyncRequestContextModule } from './modules/async-context-request/async-context-request.module';
import { QueryLogger } from './logger/query-logger';
import { LoggerModule } from './logger/logger.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RedisService } from './modules/redis/redis.service';
import { sessionConfig, cookieOption } from './constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule, LoggerModule],
      useFactory: (configService: ApiConfigService, logger: QueryLogger) => {
        return {
          ...configService.postgresConfig,
          logger,
          synchronize: false,
        };
      },
      inject: [ApiConfigService, QueryLogger],
    }),
    AsyncRequestContextModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    RedisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  constructor(private readonly redisService: RedisService) {}
  async configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        RequestLoggerMiddleware,
        session({
          secret: sessionConfig.secret,
          resave: false,
          saveUninitialized: false,
          cookie: cookieOption,
          store: new RedisStore({
            client: await this.redisService.createRedisClient(),
          }),
        }),
        passport.initialize(),
        passport.session(),
      )
      .forRoutes('*');
  }
}
