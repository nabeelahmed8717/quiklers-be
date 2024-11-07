import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import * as multer from 'multer';
import { MulterBackblazeStorage } from '../engine/multer-backblaze-storage';

@Injectable()
export class DynamicFileInterceptor implements NestInterceptor {
  private readonly upload: multer.Multer;

  constructor(bucketName: string, private readonly fields: { name: string; maxCount?: number }[]) {
    this.upload = multer({
      storage: new MulterBackblazeStorage({ bucketName }),
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse();

    return new Observable((observer) => {
      this.upload.fields(this.fields)(req, res, (err) => {
        if (err) {
          observer.error(new BadRequestException('File upload failed'));
        } else {
          observer.next(req.files); // Handle the files as an object with keys matching field names
          next.handle().subscribe({
            next: (val) => observer.next(val),
            error: (error) => observer.error(error),
            complete: () => observer.complete(),
          });
        }
      });
    });
  }
}
