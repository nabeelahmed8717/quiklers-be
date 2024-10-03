import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UserServicesModule } from './user-services/user-services.module';
import { BookingsModule } from './bookings/bookings.module';
import { EventsGateway } from './events/events.gateway';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

const envConfig = dotenv.parse(fs.readFileSync('.env'));

@Module({
  imports: [
    // MongooseModule.forRoot('mongodb://localhost:27017/quiklers'),
    MongooseModule.forRoot(envConfig.MONGODB_URI),
    UsersModule,
    AuthModule,
    UserServicesModule,
    BookingsModule,
  ],
  controllers: [],
  providers: [EventsGateway],
})
export class AppModule {}
