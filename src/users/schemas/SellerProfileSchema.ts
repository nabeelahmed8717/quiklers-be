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
  degree: string;

  @Prop({ required: true })
  institution: string;
}
class servicesInfo {
  
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

  @Prop({ required: false })
  availability?: boolean;

  @Prop({ type: [servicesInfo], required: false })
  servicesInfo?: servicesInfo[];
  
}

export const SellerProfileScheme = SchemaFactory.createForClass(SellerProfile);
