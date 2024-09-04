import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserServicesService } from './user-services.service';
import { UserServicesController } from './user-services.controller';
import { UserService, UserServiceSchema } from './schema/UserService.schema';
import { User, UserScheme } from 'src/users/schemas/User.schema';
import { Booking, BookingSchema } from 'src/bookings/schema/CreateBookings.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserService.name, schema: UserServiceSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserScheme }]),
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
  ],
  controllers: [UserServicesController],
  providers: [UserServicesService],
  exports: [UserServicesService],
})
export class UserServicesModule {}
