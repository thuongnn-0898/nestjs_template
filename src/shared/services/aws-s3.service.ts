import { S3 } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

import { ApiConfigService } from './api-config.service';

@Injectable()
export class AwsS3Service {
  private readonly s3: S3;

  constructor(public configService: ApiConfigService) {
    const awsS3Config = configService.awsS3Config;

    this.s3 = new S3({
      apiVersion: awsS3Config.bucketApiVersion,
      region: awsS3Config.bucketRegion,
    });
  }
}
