import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { DelayMiddleware } from './Middlewares/delay.middleware';

async function bootstrap() {

  dotenv.config();
  
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.use(new DelayMiddleware().use);
  await app.listen(3000);
}
bootstrap();
