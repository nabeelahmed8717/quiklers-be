import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './user.controller';
import { User, UserScheme } from './schemas/User.schema';
import { SellerProfile, SellerProfileScheme } from './schemas/SellerProfileSchema';
import { CollaboratorProfile, CollaboratorProfileScheme } from './schemas/CollaboratorProfileSchema';
import { Booking, BookingSchema } from 'src/bookings/schema/CreateBookings.schema';
import { FcmToken, FcmTokenSchema } from './schemas/CreateFcmToken.schema';
import { Company, CompanySchema } from './schemas/createCompany.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserScheme,
      },
      { name: Company.name, schema: CompanySchema },
      {
        name: SellerProfile.name,
        schema: SellerProfileScheme,
      },
      {
        name: CollaboratorProfile.name,
        schema: CollaboratorProfileScheme,
      },
      {
        name: FcmToken.name, // Register the FcmToken schema
        schema: FcmTokenSchema,
      },
    ]),
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
