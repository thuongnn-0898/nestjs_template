import type { Provider } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';

import { ApiConfigService } from './services/api-config.service';
// import { AwsS3Service } from './services/aws-s3.service';

const providers: Provider[] = [ApiConfigService]; // AwsS3Service

@Global()
@Module({
  providers,
  imports: [],
  exports: [...providers],
})
export class SharedModule {}
