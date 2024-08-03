import { Request } from 'express';

export interface CustomRequest extends Request {
  user?: {
    _id?: string;
    [key: string]: any; // Add other user properties if needed
  };
}