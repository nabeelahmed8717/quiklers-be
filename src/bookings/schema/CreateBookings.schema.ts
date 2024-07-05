import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/users/schemas/User.schema';
import { UserService } from 'src/user-services/schema/UserService.schema';

@Schema({ timestamps: true })
export class Booking extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'UserService', required: true })
  serviceInfo: UserService;

  @Prop({ required: true })
  bookingStatus: string;

  @Prop({ required: false })
  serviceRatings: number;

  @Prop({ required: false })
  serviceReviews: string;

  @Prop({ required: true })
  paymentStatus: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
