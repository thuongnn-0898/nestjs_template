import { Logger } from '@nestjs/common';

import { LoggerConstant } from '../constants';

export const ProcessLogger = (logger: Logger) => {
  process.on('uncaughtException', (exception) => {
    logger.error(
      exception.stack || exception,
      null,
      LoggerConstant.uncaughtException,
    );
  });
  process.on('unhandledRejection', (exception: any) => {
    logger.error(
      exception.stack || exception,
      null,
      LoggerConstant.unhandledRejection,
    );
  });
};
