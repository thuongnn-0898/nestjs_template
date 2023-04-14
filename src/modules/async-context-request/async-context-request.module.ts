import { AsyncLocalStorage } from 'async_hooks';
import { DynamicModule } from '@nestjs/common';

import { AsyncRequestContext } from './async-context-request.service';

type AsyncContextModuleOptions = {
  isGlobal?: boolean;
  asyncLocalStorageInstance?: AsyncLocalStorage<any>;
};

export class AsyncRequestContextModule {
  static forRoot(options?: AsyncContextModuleOptions): DynamicModule {
    const isGlobal = options?.isGlobal ?? true;
    const asyncLocalStorageInstance =
      options?.asyncLocalStorageInstance ?? new AsyncLocalStorage();

    return {
      module: AsyncRequestContextModule,
      global: isGlobal,
      providers: [
        {
          provide: AsyncRequestContext,
          useValue: new AsyncRequestContext(asyncLocalStorageInstance),
        },
      ],
      exports: [AsyncRequestContext],
    };
  }
}
