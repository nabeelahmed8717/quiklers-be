import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/users/schemas/User.schema';

@Schema({ timestamps: true })
export class UserService extends Document {
  @Prop({ required: true })
  serviceImage: string;

  @Prop({ required: true })
  serviceTitle: string;

  @Prop({ required: true })
  ratings: number;

  @Prop({ required: true })
  jobAvailabilityMode: string;

  @Prop()
  onlineSoftware?: string;

  @Prop({ required: true })
  serviceType: string;

  @Prop({ required: true })
  serviceTypeTitle: string;

  @Prop({ required: true })
  serviceDescription: string;

  @Prop()
  physicalAvailabilityMode?: string;

  @Prop({ required: true })
  hourlyRate: number;


  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  createdBy: User;

  
}

export const UserServiceSchema = SchemaFactory.createForClass(UserService);
