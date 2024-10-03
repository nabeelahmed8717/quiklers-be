import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/users/schemas/User.schema';

@Schema({ timestamps: true })
export class UserService extends Document {
  @Prop({
    type: {
      url: String,
      key: String,
      mimetype: String,
      size: Number,
      originalName: String,
    },
  })
  serviceImage: {
    key: string;
    mimetype: string;
    size: number;
    originalName: string;
  };

  @Prop({ required: true })
  serviceTitle: string;

  @Prop({ required: false })
  ratings: number;

  @Prop({ required: false })
  jobAvailabilityMode: string;

  @Prop({ required: false })
  onlineSoftware?: string;

  @Prop({ required: false })
  serviceType: string;

  @Prop({ required: false })
  serviceTypeTitle: string;

  @Prop({ required: false })
  serviceDescription: string;

  @Prop({ required: false })
  physicalAvailabilityMode?: string;

  @Prop({ required: false })
  hourlyRate: number;

  @Prop({ required: false })
  fixedRate: number;

  @Prop({ required: false })
  locationPreference: number;

  @Prop({ required: false, }) // For onlineCommunicationSoftware
  onlineCommunicationSoftware: string;
  
  @Prop({ required: false, }) // For searchTags
  searchTags: string;

  @Prop({ required: false })
  priceType: string;

  @Prop({ required: false })
  serviceAvailability: string;

  //new props

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  createdBy: User;
}

export const UserServiceSchema = SchemaFactory.createForClass(UserService);
