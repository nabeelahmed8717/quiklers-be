

import { Request } from 'express';
import { StorageEngine } from 'multer';
import * as multer from 'multer';
const B2 = require('backblaze-b2');
import { CustomFile } from '../interfaces/Express.Multer.File';
import { Readable } from 'stream';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

const envConfig = dotenv.parse(fs.readFileSync('.env'));

export interface MulterBackblazeOptions {
  bucketName: string;
  keyPrefix?: string;
}

export class MulterBackblazeStorage implements StorageEngine {
  private readonly bucketName: string;
  private readonly keyPrefix: string;
  private b2: any;

  constructor(options: MulterBackblazeOptions) {
    this.bucketName = options.bucketName;
    this.keyPrefix = options.keyPrefix || '';
    this.initializeB2();
  }

  private async initializeB2() {
    this.b2 = new B2({
      applicationKeyId: envConfig.B2_APPLICATION_KEY_ID,
      applicationKey: envConfig.B2_APPLICATION_KEY,
    });
    await this.b2.authorize();
  }

  async _handleFile(
    req: Request,
    file: CustomFile,
    cb: (error: any, info?: Partial<CustomFile>) => void,
  ): Promise<void> {
    try {
      console.log('Authorizing B2...');
      await this.b2.authorize();
      console.log('B2 authorized successfully');
  
      const fileName = `${this.keyPrefix}${Date.now()}-${file.originalname}`;
      console.log(`Preparing to upload file: ${fileName}`);
  
      // Convert stream to buffer
      const buffer = await this.streamToBuffer(file.stream);
  
      // Get bucket ID
      const { data: { buckets } } = await this.b2.getBucket({ bucketName: this.bucketName });
      const bucketId = buckets[0].bucketId;
  
      console.log('Getting upload URL...');
      const { data: uploadUrlData } = await this.b2.getUploadUrl({ bucketId });
      console.log('Upload URL obtained:', uploadUrlData.uploadUrl);
  
      console.log('Upload parameters:', {
        bucketId,
        fileName,
        contentType: file.mimetype,
        dataLength: buffer.length,
        uploadUrl: uploadUrlData.uploadUrl
      });
  
      const response = await this.b2.uploadFile({
        uploadUrl: uploadUrlData.uploadUrl,
        uploadAuthToken: uploadUrlData.authorizationToken,
        fileName,
        data: buffer,
        contentType: file.mimetype,
      });
  
      console.log('File uploaded successfully:', response.data);
  
      cb(null, {
        key: response.data.fileId,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      });
    } catch (error) {
      console.error('Error in _handleFile:', error);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      cb(error);
    }
  }

  private streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: any[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  _removeFile(
    req: Request,
    file: CustomFile,
    cb: (error: Error | null) => void,
  ): void {
    this.b2.authorize()
      .then(() => this.b2.deleteFileVersion({
        fileId: file.key,
        fileName: file.originalName,
      }))
      .then(() => cb(null))
      .catch(cb);
  }
}