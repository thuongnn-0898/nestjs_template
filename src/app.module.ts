import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/share.module';
import { RequestLoggerMiddleware } from './middlewares/request-logger.middleware';
import { AsyncRequestContextModule } from './modules/async-context-request/async-context-request.module';
import { QueryLogger } from './logger/query-logger';
import { LoggerModule } from './logger/logger.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
