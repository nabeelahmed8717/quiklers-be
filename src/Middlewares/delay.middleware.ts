import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class DelayMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const delay = 1000; // Delay in milliseconds (2 seconds)
    await new Promise(resolve => setTimeout(resolve, delay));
    next();
  }
}
