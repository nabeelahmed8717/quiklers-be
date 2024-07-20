import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

class Address {
  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  locationLink: string;
}

class Education {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;
}
class ServicesDone {
  
}

@Schema()
export class SellerProfile extends Document {
  @Prop({ required: false })

  @Prop({ required: false })
  occupation?: string;

  @Prop({ required: false })
  about?: string;

  @Prop({ required: false })
  language?: string;

  @Prop({ type: Address, required: false })
  address?: Address;

  @Prop({ type: [Education], required: false })
  education?: Education[];

  @Prop({ required: false })
  profileHourlyRate?: number;


  @Prop({ required: false })
  isProfileVerified?: boolean;

  @Prop({ type: [ServicesDone], required: false })
  servicesDone?: ServicesDone[];
  
}

export const SellerProfileScheme = SchemaFactory.createForClass(SellerProfile);
