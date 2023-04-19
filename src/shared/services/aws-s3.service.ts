import { S3 } from 'aws-sdk';
import { Injectable } from '@nestjs/common';

import { ApiConfigService } from './api-config.service';

@Injectable()
export class AwsS3Service {
  private readonly bucket: S3;

  constructor(public configService: ApiConfigService) {
    const awsS3Config = configService.awsS3Config;

    this.bucket = new S3({
      apiVersion: awsS3Config.bucketApiVersion,
      region: awsS3Config.bucketRegion,
      signatureVersion: awsS3Config.signatureVersion,
    });
  }

  async generateSignedUrl(filename: string, expires: number) {
    try {
      const bucket = this.bucket;
      const signedUrl = bucket.getSignedUrl('putObject', {
        Bucket: this.configService.awsS3Config.bucketName,
        Key: filename,
        Expires: expires,
      });
      return signedUrl;
    } catch (e) {}
  }
}
