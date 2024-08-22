import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './schema/CreateBookings.schema';
import { UserServicesModule } from 'src/user-services/user-services.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
  UserServicesModule],
  controllers: [BookingsController],
  providers: [BookingsService]
})
export class BookingsModule {}
