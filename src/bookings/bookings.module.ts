import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './schema/CreateBookings.schema';
import { UserServicesModule } from 'src/user-services/user-services.module';
import { EventsGateway } from 'src/events/events.gateway';
import { FirebaseService } from 'src/firebase-cm/firebase.service';
import { User, UserScheme } from 'src/users/schemas/User.schema';
import { FcmToken, FcmTokenSchema } from 'src/users/schemas/CreateFcmToken.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: User.name, schema: UserScheme },
      { name: FcmToken.name, schema: FcmTokenSchema }, 
    ]),
    UserServicesModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService, EventsGateway, FirebaseService],
})
export class BookingsModule {}
