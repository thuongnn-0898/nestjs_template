import type { NestMiddleware } from '@nestjs/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { v4 } from 'uuid';

import { AsyncRequestContext } from '../modules/async-context-request/async-context-request.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly asyncRequestContext: AsyncRequestContext,
  ) {}

  use(req: Request, _res: Response, next: NextFunction) {
    const requestId = v4();

    this.logger.log(`[API]: ${req.baseUrl}`, requestId);
    this.logger.log(
      `[Params]: ${JSON.stringify(req.body || req.params)}`,
      requestId,
    );
    this.asyncRequestContext.set(requestId);

    next();
  }
}
