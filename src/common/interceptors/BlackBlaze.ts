
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { MulterBackblazeStorage } from '../engine/multer-backblaze-storage';
import * as multer from 'multer';

@Injectable()
export class FileInterceptor implements NestInterceptor {
  private readonly upload: multer.Multer;

  constructor(bucketName: string) {
    this.upload = multer({
      storage: new MulterBackblazeStorage({ bucketName }),
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse();

    return new Observable((observer) => {
      this.upload.single('file')(req, res, (err) => {
        if (err) {
          observer.error(new BadRequestException('File upload failed'));
        } else {
          observer.next(req.file); // Emit the uploaded file to the next handler
          next
            .handle()
            .subscribe({
              next: (val) => observer.next(val),
              error: (error) => observer.error(error),
              complete: () => observer.complete(),
            });
        }
      });
    });
  }
}
