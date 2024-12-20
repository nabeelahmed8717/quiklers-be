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

  @Prop({ required: false })
  ownerId: string;

  @Prop({ required: false })
  bookingStatus: string;


  @Prop({
    type: {
      serviceReview: { type: String, required: false },
      serviceRatings: { type: Number, required: false },
      createdBy: { type: MongooseSchema.Types.ObjectId, ref: 'User', required: false },
      serviceReply: { type: String, required: false },
    },
    required: false,
  })
  serviceReviewAndRatings: {
    serviceReview: string;
    serviceRatings: number;
    createdBy: User;
    serviceReply: string;
  };

  @Prop({ required: false })
  paymentStatus: string;

  @Prop({ required: false })
  bookingDate: string;

  @Prop({ required: false })
  bookingTime: string;

  @Prop({ required: false })
  bookingLocation: string;

  @Prop({ required: false })
  isUrgent: boolean;
  
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
